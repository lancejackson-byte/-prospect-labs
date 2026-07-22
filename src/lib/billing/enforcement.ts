import { PLANS } from "./plans";

export function checkCreditLimit(planId: string, creditsUsed: number): boolean {
  const plan = PLANS.find((p) => p.id === planId);
  if (!plan) return false;
  return creditsUsed < plan.leadCredits;
}

export function getRemainingCredits(planId: string, creditsUsed: number): number {
  const plan = PLANS.find((p) => p.id === planId);
  if (!plan) return 0;
  return Math.max(0, plan.leadCredits - creditsUsed);
}

export function getMaxWorkspaces(planId: string): number {
  if (planId === "agency") return 10;
  return 1;
}
