import { createClient } from "@/lib/supabase/server";
import type { AnalyticsSummary } from "./types";

export async function getAnalyticsSummary(workspaceId: string): Promise<AnalyticsSummary> {
  const supabase = await createClient();

  // Get counts
  const [leadsRes, oppsRes, stagesRes] = await Promise.all([
    supabase.from("leads").select("*", { count: "exact", head: true }).eq("workspace_id", workspaceId),
    supabase.from("crm_opportunities").select("value, stage_id, crm_stages(name, color)").eq("workspace_id", workspaceId),
    supabase.from("crm_stages").select("*").eq("workspace_id", workspaceId).order("sort_order"),
  ]);

  const totalLeads = (leadsRes as { count: number }).count || 0;
  const opportunities = (oppsRes.data || []) as any[];
  const stages = (stagesRes.data || []) as any[];

  const totalDeals = opportunities.length;
  const totalValue = opportunities.reduce((sum, o) => sum + (Number(o.value) || 0), 0);
  const wonDeals = opportunities.filter((o) => {
    const stage = stages.find((s) => s.id === o.stage_id);
    return stage?.name === "Closed Won";
  }).length;
  const conversionRate = totalDeals > 0 ? Math.round((wonDeals / totalDeals) * 100) : 0;

  const pipelineData = stages.map((stage) => {
    const stageOpps = opportunities.filter((o) => o.stage_id === stage.id);
    return {
      name: stage.name,
      count: stageOpps.length,
      value: stageOpps.reduce((sum, o) => sum + (Number(o.value) || 0), 0),
      color: stage.color || "#6b7280",
    };
  });

  // Generate last 7 days activity (placeholder for now)
  const activityData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      emails: Math.floor(Math.random() * 10),
      leads: Math.floor(Math.random() * 5),
      deals: Math.floor(Math.random() * 3),
    };
  });

  return {
    totalLeads,
    totalEmails: 0, // Will be implemented when email tracking is live
    totalDeals,
    totalValue,
    conversionRate,
    pipelineData,
    activityData,
  };
}
