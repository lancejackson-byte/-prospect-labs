export interface LeadResult {
  id: string;
  company_name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  website?: string;
  industry?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  business_size?: string;
  email_status?: "unknown" | "valid" | "invalid" | "risky" | "unverified";
  source?: string;
  source_provider?: string;
  discovery_date?: string;
}

export interface LeadSearchParams {
  query?: string;
  industry?: string;
  city?: string;
  state?: string;
  business_size?: string;
  page?: number;
  limit?: number;
}

export interface LeadSearchResponse {
  leads: LeadResult[];
  total: number;
  page: number;
  limit: number;
}

export interface LeadProvider {
  search(params: LeadSearchParams): Promise<LeadSearchResponse>;
  getById(id: string): Promise<LeadResult | null>;
}
