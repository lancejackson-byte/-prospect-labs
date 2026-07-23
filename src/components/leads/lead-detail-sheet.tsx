"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Building2, Globe, Mail, MapPin, Phone, Hash, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { addLeadToCRM } from "@/lib/crm/actions";
import type { LeadResult } from "@/lib/leads/types";

interface LeadDetailSheetProps {
  lead: LeadResult | null;
  open: boolean;
  onClose: () => void;
}

export function LeadDetailSheet({ lead, open, onClose }: LeadDetailSheetProps) {
  const [addingToCRM, setAddingToCRM] = useState(false);

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

  async function handleAddToCRM() {
    setAddingToCRM(true);
    try {
      await addLeadToCRM(lead!.id, lead!.company_name);
      toast.success("Added to CRM", {
        description: `${lead!.company_name} has been added to your pipeline.`,
      });
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add to CRM";
      toast.error("Failed to add to CRM", { description: message });
    } finally {
      setAddingToCRM(false);
    }
  }

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
            <Button
              className="flex-1"
              size="sm"
              onClick={() => toast("Coming soon", { description: "Add to List will be available soon." })}
            >
              Add to List
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              size="sm"
              disabled={addingToCRM}
              onClick={handleAddToCRM}
            >
              {addingToCRM ? (
                <>
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add to CRM"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
