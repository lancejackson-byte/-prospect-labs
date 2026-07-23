import type { LeadProvider, LeadSearchParams, LeadSearchResponse, LeadResult } from "./types";
import { DEMO_LEADS } from "./demo-data";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function filterLeads(leads: LeadResult[], params: LeadSearchParams): LeadResult[] {
  return leads.filter((lead) => {
    if (params.query) {
      const q = params.query.toLowerCase();
      const match =
        lead.company_name.toLowerCase().includes(q) ||
        (lead.contact_name && lead.contact_name.toLowerCase().includes(q)) ||
        (lead.industry && lead.industry.toLowerCase().includes(q)) ||
        (lead.city && lead.city.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (params.industry && lead.industry?.toLowerCase() !== params.industry.toLowerCase()) return false;
    if (params.city && lead.city?.toLowerCase() !== params.city.toLowerCase()) return false;
    if (params.state && lead.state?.toLowerCase() !== params.state.toLowerCase()) return false;
    if (params.business_size && lead.business_size?.toLowerCase() !== params.business_size.toLowerCase()) return false;
    return true;
  });
}

export class DemoLeadProvider implements LeadProvider {
  async search(params: LeadSearchParams): Promise<LeadSearchResponse> {
    await delay(500); // Simulate network latency

    const filtered = filterLeads(DEMO_LEADS, params);
    const page = params.page || 1;
    const limit = params.limit || 10;
    const start = (page - 1) * limit;
    const paged = filtered.slice(start, start + limit);

    return {
      leads: paged,
      total: filtered.length,
      page,
      limit,
    };
  }

  async getById(id: string): Promise<LeadResult | null> {
    await delay(200);
    return DEMO_LEADS.find((l) => l.id === id) || null;
  }
}
