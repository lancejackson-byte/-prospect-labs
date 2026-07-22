import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe/server";

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

  const { planId } = await request.json();
  const stripe = getStripe();

  if (!stripe) {
    // Demo mode: no Stripe configured
    return NextResponse.json({ 
      url: null,
      message: "Stripe not configured. Demo mode active." 
    });
  }

  // Get workspace
  const { data: membership } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id)
    .single();

  const origin = request.nextUrl.origin;

  try {
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: `${planId} Plan - Prospect Labs` },
          unit_amount: planId === "pro" ? 9900 : planId === "agency" ? 29900 : 4900,
          recurring: { interval: "month" as const },
        },
        quantity: 1,
      }],
      mode: "subscription",
      metadata: { workspace_id: membership?.workspace_id || "", plan_id: planId },
      success_url: `${origin}/billing?success=true`,
      cancel_url: `${origin}/billing?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
