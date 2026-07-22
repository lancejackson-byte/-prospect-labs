"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { KanbanColumn } from "./kanban-column";
import { OpportunityCard } from "./opportunity-card";
import { OpportunityDetail } from "./opportunity-detail";
import { moveOpportunity } from "@/lib/crm/actions";

interface Stage {
  id: string;
  name: string;
  color: string;
}

interface OpportunityData {
  id: string;
  name: string;
  stage_id: string;
  value?: number;
  probability?: number;
  leads?: { company_name: string; contact_name?: string } | null;
}

interface KanbanBoardProps {
  stages: Stage[];
  opportunities: OpportunityData[];
}

export function KanbanBoard({ stages, opportunities: initialOpps }: KanbanBoardProps) {
  const [opportunities, setOpportunities] = useState(initialOpps);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedOpp, setSelectedOpp] = useState<OpportunityData | null>(null);

  const activeOpp = opportunities.find((o) => o.id === activeId);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      setActiveId(null);
      const { active, over } = event;
      if (!over) return;

      const oppId = active.id as string;
      const targetStageId = over.id as string;

      const opp = opportunities.find((o) => o.id === oppId);
      if (!opp || opp.stage_id === targetStageId) return;

      // Optimistic update
      setOpportunities((prev) =>
        prev.map((o) => (o.id === oppId ? { ...o, stage_id: targetStageId } : o))
      );

      try {
        await moveOpportunity(oppId, targetStageId);
      } catch {
        // Revert on error
        setOpportunities((prev) =>
          prev.map((o) => (o.id === oppId ? { ...o, stage_id: opp.stage_id } : o))
        );
      }
    },
    [opportunities]
  );

  const handleOppClick = useCallback(
    (id: string) => {
      const opp = opportunities.find((o) => o.id === id);
      if (opp) setSelectedOpp(opp);
    },
    [opportunities]
  );

  return (
    <>
      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => (
            <KanbanColumn
              key={stage.id}
              stage={stage}
              opportunities={opportunities.filter((o) => o.stage_id === stage.id)}
              onOpportunityClick={handleOppClick}
            />
          ))}
        </div>

        <DragOverlay>
          {activeOpp && (
            <div className="rotate-2 opacity-90">
              <OpportunityCard
                opportunity={activeOpp}
                onClick={() => {}}
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <OpportunityDetail
        opportunity={selectedOpp}
        open={!!selectedOpp}
        onClose={() => setSelectedOpp(null)}
      />
    </>
  );
}
