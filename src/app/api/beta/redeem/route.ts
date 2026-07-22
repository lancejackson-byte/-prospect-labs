import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hashCode, verifyCode } from "@/lib/beta/codes";

export async function POST(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll() {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { code } = await request.json();
  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "Code is required" }, { status: 400 });
  }

  const admin = createAdminClient();
  const codeHash = hashCode(code);

  // Find the code
  const { data: invite, error } = await admin
    .from("beta_invite_codes")
    .select("*")
    .eq("code_hash", codeHash)
    .single();

  if (error || !invite) {
    return NextResponse.json({ error: "Invalid beta code" }, { status: 400 });
  }

  if (!invite.active) {
    return NextResponse.json({ error: "This code is no longer active" }, { status: 400 });
  }

  if (invite.max_uses && invite.redemption_count >= invite.max_uses) {
    return NextResponse.json({ error: "This code has reached its usage limit" }, { status: 400 });
  }

  if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
    return NextResponse.json({ error: "This code has expired" }, { status: 400 });
  }

  // Check if user already redeemed
  const { data: existing } = await admin
    .from("beta_redemptions")
    .select("id")
    .eq("code_id", invite.id)
    .eq("user_id", user.id)
    .single();

  if (existing) {
    return NextResponse.json({ error: "You have already redeemed this code" }, { status: 400 });
  }

  // Get user's workspace
  const { data: membership } = await admin
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id)
    .single();

  // Create redemption
  await admin.from("beta_redemptions").insert({
    code_id: invite.id,
    user_id: user.id,
    workspace_id: membership?.workspace_id || null,
  });

  // Update redemption count
  await admin
    .from("beta_invite_codes")
    .update({ redemption_count: invite.redemption_count + 1 })
    .eq("id", invite.id);

  return NextResponse.json({
    success: true,
    access_level: invite.access_level,
    message: `Code redeemed! You now have ${invite.access_level} access.`,
  });
}
