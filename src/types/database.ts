// Database types for Prospect Labs
// Generated types matching our Supabase schema

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      workspaces: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      leads: {
        Row: {
          id: string;
          workspace_id: string;
          company_name: string;
          contact_name: string | null;
          email: string | null;
          phone: string | null;
          website: string | null;
          industry: string | null;
          city: string | null;
          state: string | null;
          zip: string | null;
          country: string | null;
          business_size: string | null;
          email_status: string | null;
          source: string | null;
          source_provider: string | null;
          discovery_date: string | null;
          verification_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          company_name: string;
          contact_name?: string | null;
          email?: string | null;
          phone?: string | null;
          website?: string | null;
          industry?: string | null;
          city?: string | null;
          state?: string | null;
          zip?: string | null;
          country?: string | null;
          business_size?: string | null;
          email_status?: string | null;
          source?: string | null;
          source_provider?: string | null;
          discovery_date?: string | null;
          verification_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          company_name?: string;
          contact_name?: string | null;
          email?: string | null;
          phone?: string | null;
          website?: string | null;
          industry?: string | null;
          city?: string | null;
          state?: string | null;
          zip?: string | null;
          country?: string | null;
          business_size?: string | null;
          email_status?: string | null;
          source?: string | null;
          source_provider?: string | null;
          discovery_date?: string | null;
          verification_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      crm_opportunities: {
        Row: {
          id: string;
          workspace_id: string;
          lead_id: string;
          stage_id: string;
          name: string;
          value: number | null;
          probability: number | null;
          expected_close_date: string | null;
          created_at: string;
          updated_at: string;
          closed_at: string | null;
          won: boolean | null;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          lead_id: string;
          stage_id: string;
          name: string;
          value?: number | null;
          probability?: number | null;
          expected_close_date?: string | null;
          created_at?: string;
          updated_at?: string;
          closed_at?: string | null;
          won?: boolean | null;
        };
        Update: {
          id?: string;
          workspace_id?: string;
          lead_id?: string;
          stage_id?: string;
          name?: string;
          value?: number | null;
          probability?: number | null;
          expected_close_date?: string | null;
          created_at?: string;
          updated_at?: string;
          closed_at?: string | null;
          won?: boolean | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
