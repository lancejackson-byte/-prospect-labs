"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateOpportunity } from "@/lib/crm/actions";
import { toast } from "sonner";

interface OpportunityData {
  id: string;
  name: string;
  stage_id: string;
  value?: number;
  probability?: number;
  expected_close_date?: string;
  leads?: { company_name: string; contact_name?: string } | null;
}

interface OpportunityDetailProps {
  opportunity: OpportunityData | null;
  open: boolean;
  onClose: () => void;
}

export function OpportunityDetail({ opportunity, open, onClose }: OpportunityDetailProps) {
  const [saving, setSaving] = useState(false);

  if (!opportunity) return null;

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const value = formData.get("value") ? Number(formData.get("value")) : undefined;
    const probability = formData.get("probability")
      ? Number(formData.get("probability"))
      : undefined;

    try {
      await updateOpportunity(opportunity!.id, { name, value, probability });
      toast.success("Opportunity updated");
      onClose();
    } catch {
      toast.error("Failed to update opportunity");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{opportunity.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <Label htmlFor="name">Deal Name</Label>
            <Input id="name" name="name" defaultValue={opportunity.name} required />
          </div>

          <div>
            <Label htmlFor="value">Value ($)</Label>
            <Input
              id="value"
              name="value"
              type="number"
              defaultValue={opportunity.value || ""}
              placeholder="5000"
            />
          </div>

          <div>
            <Label htmlFor="probability">Probability (%)</Label>
            <Input
              id="probability"
              name="probability"
              type="number"
              min={0}
              max={100}
              defaultValue={opportunity.probability || ""}
              placeholder="50"
            />
          </div>

          {opportunity.leads && (
            <div className="rounded-md bg-muted p-3 text-sm">
              <p className="font-medium">{opportunity.leads.company_name}</p>
              {opportunity.leads.contact_name && (
                <p className="text-muted-foreground">{opportunity.leads.contact_name}</p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
