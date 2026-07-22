"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getCRMStages(workspaceId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("crm_stages")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("sort_order");
  if (error) throw new Error(error.message);
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
