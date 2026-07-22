-- Prospect Labs: Seed Data
-- Sample plans and CRM stages for new workspaces

-- ============================================================
-- PLANS
-- ============================================================
INSERT INTO public.plans (id, name, stripe_price_id, monthly_price, lead_credits, features, is_public, sort_order)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'Starter Agent',
    NULL,
    49,
    250,
    '["250 lead credits/mo", "AI email generation", "Gmail/SMTP sending", "Pipeline CRM", "Manual campaigns", "1 workspace"]'::jsonb,
    TRUE,
    1
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'Pro Growth',
    NULL,
    99,
    2500,
    '["2,500 lead credits/mo", "Multi-step sequences", "Automated follow-ups", "Priority AI", "Advanced analytics", "CSV import/export", "Custom templates", "1 workspace"]'::jsonb,
    TRUE,
    2
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'Agency',
    NULL,
    299,
    10000,
    '["10,000 lead credits/mo", "Multi-workspace", "White-label options", "Everything in Pro Growth", "Priority support"]'::jsonb,
    FALSE,
    3
  )
ON CONFLICT DO NOTHING;

-- ============================================================
-- DEFAULT CRM STAGES (template for new workspaces)
-- ============================================================
-- These are applied via the onboarding Server Action, not as global data.
-- Included here as reference for what the onboarding creates per workspace.

-- Default stages per new workspace:
-- 1. New Lead (color: #6b7280, sort_order: 1)
-- 2. Contacted (color: #3b82f6, sort_order: 2)
-- 3. Qualified (color: #8b5cf6, sort_order: 3)
-- 4. Proposal (color: #f59e0b, sort_order: 4)
-- 5. Negotiation (color: #ef4444, sort_order: 5)
-- 6. Closed Won (color: #10b981, sort_order: 6)
-- 7. Closed Lost (color: #ef4444, sort_order: 7)
