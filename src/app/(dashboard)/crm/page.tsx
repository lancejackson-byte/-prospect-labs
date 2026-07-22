import { createClient } from "@/lib/supabase/server";
import { getCRMStages, getOpportunities } from "@/lib/crm/actions";
import { KanbanBoard } from "@/components/crm/kanban-board";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function CRMPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: membership } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user?.id || "")
    .single();

  const workspaceId = membership?.workspace_id;

  if (!workspaceId) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">CRM Pipeline</h1>
        <p className="text-muted-foreground">Complete onboarding to access your CRM.</p>
        <Button asChild>
          <Link href="/onboarding">Set Up Workspace</Link>
        </Button>
      </div>
    );
  }

  const [stages, opportunities] = await Promise.all([
    getCRMStages(workspaceId),
    getOpportunities(workspaceId),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">CRM Pipeline</h1>
          <p className="text-muted-foreground">
            Drag and drop deals between stages to manage your pipeline.
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href="/leads">
            <Plus className="mr-1 h-4 w-4" />
            Add Deal
          </Link>
        </Button>
      </div>

      {stages.length === 0 ? (
        <div className="rounded-md bg-muted p-8 text-center text-muted-foreground">
          No CRM stages configured. Please complete onboarding.
        </div>
      ) : (
        <KanbanBoard stages={stages} opportunities={opportunities || []} />
      )}
    </div>
  );
}
