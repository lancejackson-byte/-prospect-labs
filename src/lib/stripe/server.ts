import Stripe from "stripe";
import { STRIPE_SECRET_KEY } from "./config";

let stripe: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (!STRIPE_SECRET_KEY) return null;
  if (!stripe) {
    stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2025-06-16.basil" as any,
    });
  }
  return stripe;
}

export async function createCheckoutSession(params: {
  customerEmail: string;
  priceId: string;
  workspaceId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const stripe = getStripe();
  if (!stripe) throw new Error("Stripe not configured");

  return stripe.checkout.sessions.create({
    customer_email: params.customerEmail,
    line_items: [{ price: params.priceId, quantity: 1 }],
    mode: "subscription",
    metadata: { workspace_id: params.workspaceId },
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
  });
}

export async function createCustomerPortalSession(params: {
  customerId: string;
  returnUrl: string;
}) {
  const stripe = getStripe();
  if (!stripe) throw new Error("Stripe not configured");

  return stripe.billingPortal.sessions.create({
    customer: params.customerId,
    return_url: params.returnUrl,
  });
}
