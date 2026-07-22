"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Building2, Globe, Mail, MapPin, Phone, Hash } from "lucide-react";
import type { LeadResult } from "@/lib/leads/types";

interface LeadDetailSheetProps {
  lead: LeadResult | null;
  open: boolean;
  onClose: () => void;
}

export function LeadDetailSheet({ lead, open, onClose }: LeadDetailSheetProps) {
  if (!lead) return null;

  type DetailItem = {
    label: string;
    value: string | undefined | null;
    icon: React.ElementType;
    link?: string;
  };

  const details: DetailItem[] = [
    { label: "Company", value: lead.company_name, icon: Building2 },
    { label: "Contact", value: lead.contact_name, icon: Hash },
    { label: "Email", value: lead.email, icon: Mail },
    { label: "Phone", value: lead.phone, icon: Phone },
    { label: "Website", value: lead.website, icon: Globe },
    { label: "Location", value: lead.city && lead.state ? `${lead.city}, ${lead.state} ${lead.zip || ""}` : null, icon: MapPin },
    { label: "Industry", value: lead.industry, icon: Building2 },
    { label: "Company Size", value: lead.business_size ? `${lead.business_size} employees` : null, icon: Hash },
  ];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{lead.company_name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            {lead.email_status === "valid" && (
              <Badge variant="secondary" className="text-green-600">Email Verified</Badge>
            )}
            {lead.industry && <Badge variant="outline">{lead.industry}</Badge>}
          </div>

          <Separator />

          <div className="space-y-3">
            {details.map(
              (item) =>
                item.value && (
                  <div key={item.label} className="flex items-start gap-3">
                    <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="truncate text-sm">{item.value}</p>
                    </div>
                  </div>
                )
            )}
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button className="flex-1" size="sm">
              Add to List
            </Button>
            <Button variant="outline" className="flex-1" size="sm">
              Add to CRM
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
