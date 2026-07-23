"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const DEFAULT_STAGES = [
  { name: "New Lead", sort_order: 0, color: "#6b7280", is_default: true },
  { name: "Contacted", sort_order: 1, color: "#3b82f6", is_default: false },
  { name: "Qualified", sort_order: 2, color: "#8b5cf6", is_default: false },
  { name: "Proposal", sort_order: 3, color: "#f59e0b", is_default: false },
  { name: "Negotiation", sort_order: 4, color: "#ef4444", is_default: false },
  { name: "Closed Won", sort_order: 5, color: "#22c55e", is_default: false },
  { name: "Closed Lost", sort_order: 6, color: "#9ca3af", is_default: false },
];

export async function seedDefaultStages(workspaceId: string) {
  const supabase = await createClient();
  const stages = DEFAULT_STAGES.map((s) => ({
    ...s,
    workspace_id: workspaceId,
  }));
  const { error } = await supabase.from("crm_stages").insert(stages);
  if (error) throw new Error(error.message);
}

export async function getCRMStages(workspaceId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("crm_stages")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("sort_order");
  if (error) throw new Error(error.message);

  // Auto-seed default stages if none exist
  if (!data || data.length === 0) {
    await seedDefaultStages(workspaceId);
    const { data: seeded, error: seedErr } = await supabase
      .from("crm_stages")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("sort_order");
    if (seedErr) throw new Error(seedErr.message);
    return seeded;
  }

  return data;
}

export async function getOpportunities(workspaceId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("crm_opportunities")
    .select("*, leads(company_name, contact_name, email), crm_stages(name, color)")
    .eq("workspace_id", workspaceId)
    .order("created_at");
  if (error) throw new Error(error.message);
  return data;
}

export async function moveOpportunity(opportunityId: string, stageId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("crm_opportunities")
    .update({ stage_id: stageId, updated_at: new Date().toISOString() })
    .eq("id", opportunityId);
  if (error) throw new Error(error.message);
  revalidatePath("/crm");
}

export async function createOpportunity(data: {
  workspace_id: string;
  lead_id: string;
  stage_id: string;
  name: string;
  value?: number;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("crm_opportunities").insert(data);
  if (error) throw new Error(error.message);
  revalidatePath("/crm");
}

export async function addLeadToCRM(leadId: string, companyName: string) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Get workspace
  const { data: membership } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id)
    .single();
  if (!membership?.workspace_id) throw new Error("No workspace found");

  const workspaceId = membership.workspace_id;

  // Get the default "New Lead" stage
  const { data: stages } = await supabase
    .from("crm_stages")
    .select("id, name, is_default")
    .eq("workspace_id", workspaceId)
    .order("sort_order");

  let newLeadStage = stages?.find((s) => s.is_default || s.name === "New Lead");

  // If no stages exist, seed them
  if (!newLeadStage) {
    await seedDefaultStages(workspaceId);
    const { data: seededStages } = await supabase
      .from("crm_stages")
      .select("id, name, is_default")
      .eq("workspace_id", workspaceId)
      .order("sort_order");
    newLeadStage = seededStages?.find((s) => s.is_default || s.name === "New Lead");
  }

  if (!newLeadStage) throw new Error("Default CRM stage not found");

  // Create the opportunity
  const { error } = await supabase.from("crm_opportunities").insert({
    workspace_id: workspaceId,
    lead_id: leadId,
    stage_id: newLeadStage.id,
    name: companyName,
    probability: 20,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/crm");
  revalidatePath("/leads");
}

export async function updateOpportunity(
  id: string,
  data: { name?: string; value?: number; probability?: number; expected_close_date?: string }
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("crm_opportunities")
    .update(data)
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/crm");
}
