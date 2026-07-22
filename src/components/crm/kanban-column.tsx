"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { OpportunityCard } from "./opportunity-card";
import { Badge } from "@/components/ui/badge";

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

interface KanbanColumnProps {
  stage: Stage;
  opportunities: OpportunityData[];
  onOpportunityClick: (id: string) => void;
}

export function KanbanColumn({ stage, opportunities, onOpportunityClick }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });

  return (
    <div
      className={`flex w-72 shrink-0 flex-col rounded-lg border bg-muted/30 ${
        isOver ? "border-primary ring-1 ring-primary" : ""
      }`}
    >
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: stage.color }}
          />
          <h3 className="font-medium text-sm">{stage.name}</h3>
        </div>
        <Badge variant="secondary" className="text-xs">
          {opportunities.length}
        </Badge>
      </div>

      <div ref={setNodeRef} className="flex-1 space-y-2 p-2 min-h-[200px]">
        <SortableContext
          items={opportunities.map((o) => o.id)}
          strategy={verticalListSortingStrategy}
        >
          {opportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onClick={onOpportunityClick}
            />
          ))}
        </SortableContext>

        {opportunities.length === 0 && (
          <div className="flex h-20 items-center justify-center rounded-md border border-dashed text-xs text-muted-foreground">
            Drop deals here
          </div>
        )}
      </div>
    </div>
  );
}
