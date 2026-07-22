import { createClient } from "@/lib/supabase/server";
import { getAnalyticsSummary } from "@/lib/analytics/queries";
import { StatCard } from "@/components/analytics/stat-card";
import { PipelineFunnel } from "@/components/analytics/pipeline-funnel";
import { ActivityChart } from "@/components/analytics/activity-chart";
import { Search, Mail, TrendingUp, DollarSign, Target } from "lucide-react";

export default async function AnalyticsPage() {
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
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Complete onboarding to view analytics.</p>
      </div>
    );
  }

  const summary = await getAnalyticsSummary(workspaceId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Track your pipeline performance and outreach activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Leads"
          value={summary.totalLeads}
          icon={Search}
          description="Leads in database"
        />
        <StatCard
          title="Total Emails"
          value={summary.totalEmails || 0}
          icon={Mail}
          description="Emails sent"
        />
        <StatCard
          title="Open Deals"
          value={summary.totalDeals}
          icon={TrendingUp}
          description="Active opportunities"
        />
        <StatCard
          title="Pipeline Value"
          value={`$${summary.totalValue.toLocaleString()}`}
          icon={DollarSign}
          description={`${summary.conversionRate}% conversion rate`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PipelineFunnel data={summary.pipelineData} />
        <ActivityChart data={summary.activityData} />
      </div>
    </div>
  );
}
