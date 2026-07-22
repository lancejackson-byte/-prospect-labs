import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { onboardingFormSchema } from "@/lib/validations/schemas";
import { slugify } from "@/lib/utils";

const DEFAULT_CRM_STAGES = [
  { name: "New Lead", color: "#6b7280", sort_order: 1 },
  { name: "Contacted", color: "#3b82f6", sort_order: 2 },
  { name: "Qualified", color: "#8b5cf6", sort_order: 3 },
  { name: "Proposal", color: "#f59e0b", sort_order: 4 },
  { name: "Negotiation", color: "#ef4444", sort_order: 5 },
  { name: "Closed Won", color: "#10b981", sort_order: 6 },
  { name: "Closed Lost", color: "#dc2626", sort_order: 7 },
];

export async function POST(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {}, // API routes don't need to set cookies
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  try {
    const body = await request.json();
    const parsed = onboardingFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", fieldErrors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const slug = slugify(data.business_name) + "-" + Date.now().toString(36);

    const { data: workspace, error: wsError } = await admin
      .from("workspaces")
      .insert({ name: data.business_name, slug })
      .select()
      .single();

    if (wsError) throw wsError;

    await admin.from("workspace_members").insert({
      workspace_id: workspace.id,
      user_id: user.id,
      role: "owner",
    });

    await admin.from("business_profiles").insert({
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

    const stages = DEFAULT_CRM_STAGES.map((stage) => ({
      ...stage,
      workspace_id: workspace.id,
      is_default: true,
    }));
    await admin.from("crm_stages").insert(stages);

    return NextResponse.json({ success: true, workspaceId: workspace.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Onboarding failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
