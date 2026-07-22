"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { onboardingFormSchema } from "@/lib/validations/schemas";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const DEFAULT_CRM_STAGES = [
  { name: "New Lead", color: "#6b7280", sort_order: 1 },
  { name: "Contacted", color: "#3b82f6", sort_order: 2 },
  { name: "Qualified", color: "#8b5cf6", sort_order: 3 },
  { name: "Proposal", color: "#f59e0b", sort_order: 4 },
  { name: "Negotiation", color: "#ef4444", sort_order: 5 },
  { name: "Closed Won", color: "#10b981", sort_order: 6 },
  { name: "Closed Lost", color: "#dc2626", sort_order: 7 },
];

export async function completeOnboarding(formData: FormData) {
  const supabase = await createClient();
  const admin = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const rawData = Object.fromEntries(formData.entries());
  const parsed = onboardingFormSchema.safeParse(rawData);

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return { error: "Validation failed", fieldErrors: errors };
  }

  const data = parsed.data;

  try {
    // Create workspace
    const slug = slugify(data.business_name) + "-" + Date.now().toString(36);
    const { data: workspace, error: wsError } = await admin
      .from("workspaces")
      .insert({ name: data.business_name, slug })
      .select()
      .single();

    if (wsError) throw new Error("Failed to create workspace: " + wsError.message);

    // Add user as owner
    const { error: memberError } = await admin
      .from("workspace_members")
      .insert({ workspace_id: workspace.id, user_id: user.id, role: "owner" });

    if (memberError) throw new Error("Failed to add member: " + memberError.message);

    // Create business profile
    const { error: bpError } = await admin
      .from("business_profiles")
      .insert({
        workspace_id: workspace.id,
        business_name: data.business_name,
        user_display_name: data.user_display_name,
        business_type: data.business_type,
        primary_service: data.primary_service,
        target_customer: data.target_customer || null,
        service_area: data.service_area || null,
        website: data.website || null,
        phone: data.phone || null,
        email_signature: data.email_signature || null,
        value_proposition: data.value_proposition || null,
        preferred_cta: data.preferred_cta || null,
        custom_pitch_line: data.custom_pitch_line || null,
        onboarding_completed: true,
      });

    if (bpError) throw new Error("Failed to create business profile: " + bpError.message);

    // Create default CRM stages
    const stages = DEFAULT_CRM_STAGES.map((stage) => ({
      ...stage,
      workspace_id: workspace.id,
      is_default: true,
    }));
    const { error: stageError } = await admin.from("crm_stages").insert(stages);

    if (stageError) throw new Error("Failed to create CRM stages: " + stageError.message);

    revalidatePath("/dashboard");
    return { success: true, workspaceId: workspace.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Onboarding failed";
    return { error: message };
  }
}
