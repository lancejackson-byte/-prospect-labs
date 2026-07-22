-- Prospect Labs: Initial Database Schema
-- Migration 00001

-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- HELPER: auto-updated_at trigger function
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- TABLES
-- ============================================================

-- Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Trigger: auto-update updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Workspaces
CREATE TABLE IF NOT EXISTS public.workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_workspaces_slug ON public.workspaces(slug);
CREATE TRIGGER update_workspaces_updated_at
  BEFORE UPDATE ON public.workspaces
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Workspace Members
CREATE TABLE IF NOT EXISTS public.workspace_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user ON public.workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace ON public.workspace_members(workspace_id);

-- Business Profiles
CREATE TABLE IF NOT EXISTS public.business_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE UNIQUE,
  business_name TEXT,
  user_display_name TEXT,
  business_type TEXT,
  primary_service TEXT,
  target_customer TEXT,
  service_area TEXT,
  website TEXT,
  phone TEXT,
  email_signature TEXT,
  value_proposition TEXT,
  preferred_cta TEXT,
  custom_pitch_line TEXT,
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_business_profiles_updated_at
  BEFORE UPDATE ON public.business_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Plans
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  stripe_price_id TEXT,
  monthly_price INTEGER NOT NULL DEFAULT 0,
  lead_credits INTEGER NOT NULL DEFAULT 0,
  features JSONB DEFAULT '[]'::jsonb,
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.plans(id) ON DELETE SET NULL,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  status TEXT NOT NULL DEFAULT 'inactive',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_subscriptions_workspace ON public.subscriptions(workspace_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe ON public.subscriptions(stripe_subscription_id);
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Beta Invite Codes
CREATE TABLE IF NOT EXISTS public.beta_invite_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code_hash TEXT NOT NULL,
  code_prefix TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  max_uses INTEGER,
  redemption_count INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ,
  assigned_company TEXT,
  access_level TEXT NOT NULL DEFAULT 'pro',
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Beta Redemptions
CREATE TABLE IF NOT EXISTS public.beta_redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code_id UUID NOT NULL REFERENCES public.beta_invite_codes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE SET NULL,
  redeemed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  UNIQUE(code_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_beta_redemptions_user ON public.beta_redemptions(user_id);

-- Leads
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  industry TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  country TEXT DEFAULT 'US',
  business_size TEXT,
  email_status TEXT CHECK (email_status IN ('unknown', 'valid', 'invalid', 'risky', 'unverified')),
  source TEXT,
  source_provider TEXT,
  discovery_date TIMESTAMPTZ DEFAULT NOW(),
  verification_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_leads_workspace ON public.leads(workspace_id);
CREATE INDEX IF NOT EXISTS idx_leads_industry ON public.leads(industry);
CREATE INDEX IF NOT EXISTS idx_leads_city ON public.leads(city);
CREATE INDEX IF NOT EXISTS idx_leads_state ON public.leads(state);
CREATE INDEX IF NOT EXISTS idx_leads_email_status ON public.leads(email_status);
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Saved Leads (bookmarks)
CREATE TABLE IF NOT EXISTS public.saved_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  list_name TEXT,
  notes TEXT,
  tags TEXT[],
  saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_saved_leads_workspace ON public.saved_leads(workspace_id);

-- Lead Lists
CREATE TABLE IF NOT EXISTS public.lead_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_lead_lists_workspace ON public.lead_lists(workspace_id);

-- List Entries (junction)
CREATE TABLE IF NOT EXISTS public.list_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  list_id UUID NOT NULL REFERENCES public.lead_lists(id) ON DELETE CASCADE,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(list_id, lead_id)
);
CREATE INDEX IF NOT EXISTS idx_list_entries_list ON public.list_entries(list_id);
CREATE INDEX IF NOT EXISTS idx_list_entries_lead ON public.list_entries(lead_id);

-- Email Templates
CREATE TABLE IF NOT EXISTS public.email_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  tone TEXT DEFAULT 'professional',
  length TEXT DEFAULT 'medium',
  category TEXT,
  is_preset BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_email_templates_workspace ON public.email_templates(workspace_id);
CREATE TRIGGER update_email_templates_updated_at
  BEFORE UPDATE ON public.email_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Email Integrations (SMTP creds, encrypted)
CREATE TABLE IF NOT EXISTS public.email_integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('gmail', 'outlook', 'smtp', 'sendgrid', 'mailgun')),
  credentials_encrypted TEXT,
  email_address TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_email_integrations_workspace ON public.email_integrations(workspace_id);
CREATE TRIGGER update_email_integrations_updated_at
  BEFORE UPDATE ON public.email_integrations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Campaigns
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
  list_id UUID REFERENCES public.lead_lists(id) ON DELETE SET NULL,
  template_id UUID REFERENCES public.email_templates(id) ON DELETE SET NULL,
  integration_id UUID REFERENCES public.email_integrations(id) ON DELETE SET NULL,
  steps_config JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_campaigns_workspace ON public.campaigns(workspace_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(status);
CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Campaign Leads (junction)
CREATE TABLE IF NOT EXISTS public.campaign_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  last_action_at TIMESTAMPTZ,
  next_action_at TIMESTAMPTZ,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  UNIQUE(campaign_id, lead_id)
);
CREATE INDEX IF NOT EXISTS idx_campaign_leads_campaign ON public.campaign_leads(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_leads_status ON public.campaign_leads(status);

-- Email Queue
CREATE TABLE IF NOT EXISTS public.email_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  campaign_lead_id UUID REFERENCES public.campaign_leads(id) ON DELETE SET NULL,
  to_email TEXT NOT NULL,
  from_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'sent', 'delivered', 'bounced', 'failed', 'opened', 'clicked')),
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_email_queue_workspace ON public.email_queue(workspace_id);
CREATE INDEX IF NOT EXISTS idx_email_queue_status ON public.email_queue(status);
CREATE INDEX IF NOT EXISTS idx_email_queue_scheduled ON public.email_queue(scheduled_at);

-- Email Events
CREATE TABLE IF NOT EXISTS public.email_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  queue_id UUID NOT NULL REFERENCES public.email_queue(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained', 'unsubscribed')),
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);
CREATE INDEX IF NOT EXISTS idx_email_events_queue ON public.email_events(queue_id);

-- Email Suppressions
CREATE TABLE IF NOT EXISTS public.email_suppressions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('bounced', 'complained', 'unsubscribed', 'manual')),
  suppressed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  suppressed_by UUID REFERENCES auth.users(id),
  UNIQUE(workspace_id, email)
);
CREATE INDEX IF NOT EXISTS idx_email_suppressions_workspace ON public.email_suppressions(workspace_id);

-- CRM Stages
CREATE TABLE IF NOT EXISTS public.crm_stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  color TEXT DEFAULT '#6b7280',
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_crm_stages_workspace ON public.crm_stages(workspace_id);

-- CRM Opportunities
CREATE TABLE IF NOT EXISTS public.crm_opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  stage_id UUID NOT NULL REFERENCES public.crm_stages(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  value DECIMAL(12,2),
  probability INTEGER CHECK (probability >= 0 AND probability <= 100),
  expected_close_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  closed_at TIMESTAMPTZ,
  won BOOLEAN
);
CREATE INDEX IF NOT EXISTS idx_crm_opportunities_workspace ON public.crm_opportunities(workspace_id);
CREATE INDEX IF NOT EXISTS idx_crm_opportunities_stage ON public.crm_opportunities(stage_id);
CREATE INDEX IF NOT EXISTS idx_crm_opportunities_lead ON public.crm_opportunities(lead_id);
CREATE TRIGGER update_crm_opportunities_updated_at
  BEFORE UPDATE ON public.crm_opportunities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- CRM Notes
CREATE TABLE IF NOT EXISTS public.crm_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_id UUID NOT NULL REFERENCES public.crm_opportunities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_crm_notes_opportunity ON public.crm_notes(opportunity_id);

-- CRM Tasks
CREATE TABLE IF NOT EXISTS public.crm_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_id UUID NOT NULL REFERENCES public.crm_opportunities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_opportunity ON public.crm_tasks(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_crm_tasks_user ON public.crm_tasks(user_id);

-- Usage Records
CREATE TABLE IF NOT EXISTS public.usage_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  searches_used INTEGER NOT NULL DEFAULT 0,
  leads_revealed INTEGER NOT NULL DEFAULT 0,
  emails_generated INTEGER NOT NULL DEFAULT 0,
  emails_sent INTEGER NOT NULL DEFAULT 0,
  verification_credits_used INTEGER NOT NULL DEFAULT 0,
  UNIQUE(workspace_id, period_start)
);
CREATE INDEX IF NOT EXISTS idx_usage_records_workspace ON public.usage_records(workspace_id);

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT NOT NULL DEFAULT 'info',
  read BOOLEAN NOT NULL DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(user_id, read);

-- Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource TEXT,
  resource_id UUID,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_workspace ON public.audit_logs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Trigger: auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Helper: get workspace member role
CREATE OR REPLACE FUNCTION public.get_workspace_role(workspace_id UUID)
RETURNS TEXT AS $$
  SELECT role FROM public.workspace_members
  WHERE workspace_id = $1 AND user_id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper: check if user is workspace member
CREATE OR REPLACE FUNCTION public.is_workspace_member(workspace_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = $1 AND user_id = auth.uid()
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper: check if user is workspace admin
CREATE OR REPLACE FUNCTION public.is_workspace_admin(workspace_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = $1 AND user_id = auth.uid()
    AND role IN ('owner', 'admin')
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper: get workspace remaining credits
CREATE OR REPLACE FUNCTION public.get_workspace_credits(workspace_id UUID)
RETURNS INTEGER AS $$
DECLARE
  plan_credits INTEGER;
  used_credits INTEGER;
BEGIN
  SELECT COALESCE(p.lead_credits, 0) INTO plan_credits
  FROM public.subscriptions s
  JOIN public.plans p ON p.id = s.plan_id
  WHERE s.workspace_id = $1 AND s.status = 'active'
  ORDER BY s.created_at DESC LIMIT 1;

  SELECT COALESCE(SUM(leads_revealed), 0) INTO used_credits
  FROM public.usage_records
  WHERE workspace_id = $1;

  RETURN GREATEST(0, plan_credits - used_credits);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beta_invite_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beta_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.list_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_suppressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/write their own profile
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Workspaces: members can read their workspaces
CREATE POLICY "Members can read workspaces" ON public.workspaces
  FOR SELECT USING (public.is_workspace_member(id));
CREATE POLICY "Owners can insert workspaces" ON public.workspaces
  FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins can update workspaces" ON public.workspaces
  FOR UPDATE USING (public.is_workspace_admin(id));
CREATE POLICY "Owners can delete workspaces" ON public.workspaces
  FOR DELETE USING (public.get_workspace_role(id) = 'owner');

-- Workspace Members: members can read
CREATE POLICY "Members can read members" ON public.workspace_members
  FOR SELECT USING (public.is_workspace_member(workspace_id));
CREATE POLICY "Admins can manage members" ON public.workspace_members
  FOR ALL USING (public.is_workspace_admin(workspace_id));

-- Business Profiles: members can read, admins can modify
CREATE POLICY "Members can read business profile" ON public.business_profiles
  FOR SELECT USING (public.is_workspace_member(workspace_id));
CREATE POLICY "Admins can modify business profile" ON public.business_profiles
  FOR ALL USING (public.is_workspace_admin(workspace_id));

-- Plans: public read
CREATE POLICY "Anyone can read plans" ON public.plans
  FOR SELECT USING (TRUE);

-- Subscriptions: members can read own workspace
CREATE POLICY "Members can read subscriptions" ON public.subscriptions
  FOR SELECT USING (public.is_workspace_member(workspace_id));

-- Beta codes: only creator and admins
CREATE POLICY "Creators can read own codes" ON public.beta_invite_codes
  FOR SELECT USING (created_by = auth.uid());

-- Leads: members can read workspace leads
CREATE POLICY "Members can read leads" ON public.leads
  FOR SELECT USING (public.is_workspace_member(workspace_id));
CREATE POLICY "Members can insert leads" ON public.leads
  FOR INSERT WITH CHECK (public.is_workspace_member(workspace_id));
CREATE POLICY "Members can update leads" ON public.leads
  FOR UPDATE USING (public.is_workspace_member(workspace_id));
CREATE POLICY "Members can delete leads" ON public.leads
  FOR DELETE USING (public.is_workspace_admin(workspace_id));

-- Saved Leads
CREATE POLICY "Members can read saved leads" ON public.saved_leads
  FOR SELECT USING (public.is_workspace_member(workspace_id));
CREATE POLICY "Members can manage saved leads" ON public.saved_leads
  FOR ALL USING (public.is_workspace_member(workspace_id));

-- Lead Lists
CREATE POLICY "Members can read lists" ON public.lead_lists
  FOR SELECT USING (public.is_workspace_member(workspace_id));
CREATE POLICY "Members can manage lists" ON public.lead_lists
  FOR ALL USING (public.is_workspace_member(workspace_id));

-- List Entries
CREATE POLICY "Members can read list entries" ON public.list_entries
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.lead_lists l WHERE l.id = list_id AND public.is_workspace_member(l.workspace_id)
  ));
CREATE POLICY "Members can manage list entries" ON public.list_entries
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.lead_lists l WHERE l.id = list_id AND public.is_workspace_member(l.workspace_id)
  ));

-- Email Templates
CREATE POLICY "Members can read templates" ON public.email_templates
  FOR SELECT USING (public.is_workspace_member(workspace_id));
CREATE POLICY "Members can manage templates" ON public.email_templates
  FOR ALL USING (public.is_workspace_member(workspace_id));

-- Email Integrations
CREATE POLICY "Members can read integrations" ON public.email_integrations
  FOR SELECT USING (public.is_workspace_member(workspace_id));
CREATE POLICY "Members can manage integrations" ON public.email_integrations
  FOR ALL USING (public.is_workspace_member(workspace_id));

-- Campaigns
CREATE POLICY "Members can read campaigns" ON public.campaigns
  FOR SELECT USING (public.is_workspace_member(workspace_id));
CREATE POLICY "Members can manage campaigns" ON public.campaigns
  FOR ALL USING (public.is_workspace_member(workspace_id));

-- Campaign Leads
CREATE POLICY "Members can read campaign leads" ON public.campaign_leads
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.campaigns c WHERE c.id = campaign_id AND public.is_workspace_member(c.workspace_id)
  ));
CREATE POLICY "Members can manage campaign leads" ON public.campaign_leads
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.campaigns c WHERE c.id = campaign_id AND public.is_workspace_member(c.workspace_id)
  ));

-- Email Queue
CREATE POLICY "Members can read email queue" ON public.email_queue
  FOR SELECT USING (public.is_workspace_member(workspace_id));
CREATE POLICY "Members can manage email queue" ON public.email_queue
  FOR ALL USING (public.is_workspace_member(workspace_id));

-- Email Events
CREATE POLICY "Members can read email events" ON public.email_events
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.email_queue q WHERE q.id = queue_id AND public.is_workspace_member(q.workspace_id)
  ));

-- Email Suppressions
CREATE POLICY "Members can read suppressions" ON public.email_suppressions
  FOR SELECT USING (public.is_workspace_member(workspace_id));
CREATE POLICY "Members can manage suppressions" ON public.email_suppressions
  FOR ALL USING (public.is_workspace_member(workspace_id));

-- CRM Stages
CREATE POLICY "Members can read stages" ON public.crm_stages
  FOR SELECT USING (public.is_workspace_member(workspace_id));
CREATE POLICY "Admins can manage stages" ON public.crm_stages
  FOR ALL USING (public.is_workspace_admin(workspace_id));

-- CRM Opportunities
CREATE POLICY "Members can read opportunities" ON public.crm_opportunities
  FOR SELECT USING (public.is_workspace_member(workspace_id));
CREATE POLICY "Members can manage opportunities" ON public.crm_opportunities
  FOR ALL USING (public.is_workspace_member(workspace_id));

-- CRM Notes
CREATE POLICY "Members can read notes" ON public.crm_notes
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.crm_opportunities o WHERE o.id = opportunity_id AND public.is_workspace_member(o.workspace_id)
  ));
CREATE POLICY "Members can manage notes" ON public.crm_notes
  FOR ALL USING (auth.uid() = user_id);

-- CRM Tasks
CREATE POLICY "Members can read tasks" ON public.crm_tasks
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.crm_opportunities o WHERE o.id = opportunity_id AND public.is_workspace_member(o.workspace_id)
  ));
CREATE POLICY "Members can manage tasks" ON public.crm_tasks
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.crm_opportunities o WHERE o.id = opportunity_id AND public.is_workspace_member(o.workspace_id)
  ));

-- Usage Records
CREATE POLICY "Members can read usage" ON public.usage_records
  FOR SELECT USING (public.is_workspace_member(workspace_id));

-- Notifications
CREATE POLICY "Users can read own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Audit Logs
CREATE POLICY "Members can read audit logs" ON public.audit_logs
  FOR SELECT USING (workspace_id IS NULL OR public.is_workspace_member(workspace_id));
CREATE POLICY "Users can insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
