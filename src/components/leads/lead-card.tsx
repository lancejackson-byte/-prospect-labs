"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Mail, MapPin, Phone } from "lucide-react";
import type { LeadResult } from "@/lib/leads/types";

interface LeadCardProps {
  lead: LeadResult;
  onClick: () => void;
}

export function LeadCard({ lead, onClick }: LeadCardProps) {
  return (
    <Card
      className="cursor-pointer transition-colors hover:border-primary/50 hover:bg-accent/30"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold">{lead.company_name}</h3>
            {lead.contact_name && (
              <p className="text-sm text-muted-foreground">{lead.contact_name}</p>
            )}
          </div>
          {lead.email_status === "valid" && (
            <Badge variant="outline" className="ml-2 shrink-0 text-green-600">
              Verified
            </Badge>
          )}
        </div>

        <div className="mt-3 space-y-1.5">
          {lead.industry && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Building2 className="h-3 w-3" />
              {lead.industry}
            </div>
          )}
          {lead.city && lead.state && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {lead.city}, {lead.state}
            </div>
          )}
          {lead.email && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Mail className="h-3 w-3" />
              <span className="truncate">{lead.email}</span>
            </div>
          )}
          {lead.phone && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Phone className="h-3 w-3" />
              {lead.phone}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
