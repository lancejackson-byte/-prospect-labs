"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, DollarSign, User } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface OpportunityData {
  id: string;
  name: string;
  value?: number;
  probability?: number;
  leads?: { company_name: string; contact_name?: string } | null;
}

interface OpportunityCardProps {
  opportunity: OpportunityData;
  onClick: (id: string) => void;
}

export function OpportunityCard({ opportunity, onClick }: OpportunityCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: opportunity.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        className="cursor-grab active:cursor-grabbing hover:border-primary/30"
        onClick={() => onClick(opportunity.id)}
      >
        <CardContent className="p-3 space-y-2">
          <h4 className="font-medium text-sm truncate">{opportunity.name}</h4>
          {opportunity.leads && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Building2 className="h-3 w-3" />
              <span className="truncate">{opportunity.leads.company_name}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            {opportunity.value != null && (
              <div className="flex items-center gap-1 text-xs font-medium">
                <DollarSign className="h-3 w-3 text-green-600" />
                ${opportunity.value.toLocaleString()}
              </div>
            )}
            {opportunity.probability != null && (
              <Badge variant="secondary" className="text-xs">
                {opportunity.probability}%
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
