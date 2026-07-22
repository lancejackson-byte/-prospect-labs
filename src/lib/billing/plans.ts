export const PLANS = [
  {
    id: "starter",
    name: "Starter Agent",
    monthlyPrice: 49,
    leadCredits: 250,
    features: [
      "250 lead credits/mo",
      "AI email generation",
      "Gmail/SMTP sending",
      "Pipeline CRM",
      "Manual campaigns",
      "1 workspace",
    ],
  },
  {
    id: "pro",
    name: "Pro Growth",
    monthlyPrice: 99,
    leadCredits: 2500,
    features: [
      "2,500 lead credits/mo",
      "Multi-step sequences",
      "Automated follow-ups",
      "Priority AI",
      "Advanced analytics",
      "CSV import/export",
      "Custom templates",
      "1 workspace",
    ],
  },
  {
    id: "agency",
    name: "Agency",
    monthlyPrice: 299,
    leadCredits: 10000,
    features: [
      "10,000 lead credits/mo",
      "Multi-workspace",
      "White-label options",
      "Everything in Pro Growth",
      "Priority support",
    ],
  },
];

export function getPlanById(id: string) {
  return PLANS.find((p) => p.id === id);
}
