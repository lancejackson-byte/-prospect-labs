"use client";

import { useState } from "react";
import { CampaignWizard } from "@/components/campaigns/campaign-wizard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SequenceStep {
  id: string;
  type: "email" | "delay";
  template_id?: string;
  delay_hours?: number;
}

interface SavedCampaign {
  id: string;
  name: string;
  status: string;
  steps: SequenceStep[];
}

export default function CampaignsPage() {
  const [showWizard, setShowWizard] = useState(false);
  const [campaigns, setCampaigns] = useState<SavedCampaign[]>([]);

  function handleSave(data: { name: string; steps: SequenceStep[] }) {
    const newCampaign: SavedCampaign = {
      id: crypto.randomUUID(),
      name: data.name,
      status: "draft",
      steps: data.steps,
    };
    setCampaigns((prev) => [newCampaign, ...prev]);
    setShowWizard(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">
            Create and manage your email outreach campaigns.
          </p>
        </div>
        <Button onClick={() => setShowWizard(true)}>
          <Plus className="mr-1 h-4 w-4" />
          New Campaign
        </Button>
      </div>

      {showWizard && (
        <CampaignWizard onSave={handleSave} />
      )}

      {campaigns.length === 0 && !showWizard ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Mail className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-medium">No campaigns yet</h3>
          <p className="text-sm text-muted-foreground">
            Create your first email campaign to start reaching prospects.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((camp) => (
            <Card key={camp.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{camp.name}</CardTitle>
                  <Badge variant="secondary">{camp.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {camp.steps.length} step{camp.steps.length !== 1 ? "s" : ""}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
