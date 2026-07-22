"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SequenceBuilder } from "./sequence-builder";
import { toast } from "sonner";

interface SequenceStep {
  id: string;
  type: "email" | "delay";
  template_id?: string;
  delay_hours?: number;
}

interface CampaignWizardProps {
  onSave: (data: { name: string; steps: SequenceStep[] }) => void;
}

export function CampaignWizard({ onSave }: CampaignWizardProps) {
  const [name, setName] = useState("");
  const [steps, setSteps] = useState<SequenceStep[]>([]);

  function handleCreate() {
    if (!name.trim()) {
      toast.error("Campaign name is required");
      return;
    }
    onSave({ name, steps });
    toast.success("Campaign created!");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Campaign</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="campaignName">Campaign Name</Label>
          <Input
            id="campaignName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Q4 Outreach - Chicago Offices"
          />
        </div>

        <SequenceBuilder steps={steps} onChange={setSteps} />

        <Button onClick={handleCreate} className="w-full">
          Create Campaign
        </Button>
      </CardContent>
    </Card>
  );
}
