"use client";

import { useState } from "react";
import { getLeadProvider } from "@/lib/leads/provider-factory";
import type { LeadResult, LeadSearchParams } from "@/lib/leads/types";
import { LeadsSearch } from "@/components/leads/leads-search";
import { LeadsFilter } from "@/components/leads/leads-filter";
import { LeadCard } from "@/components/leads/lead-card";
import { LeadDetailSheet } from "@/components/leads/lead-detail-sheet";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";

export default function LeadsPage() {
  const [leads, setLeads] = useState<LeadResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<LeadResult | null>(null);
  const [params, setParams] = useState<LeadSearchParams>({ limit: 12, page: 1 });
  const [total, setTotal] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  async function searchLeads(searchParams: LeadSearchParams) {
    setLoading(true);
    setError(null);
    try {
      const provider = getLeadProvider();
      const result = await provider.search(searchParams);
      setLeads(result.leads);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(query: string) {
    setHasSearched(true);
    const newParams = { ...params, query, page: 1 };
    setParams(newParams);
    searchLeads(newParams);
  }

  function handleFilter(filters: Partial<LeadSearchParams>) {
    setHasSearched(true);
    const newParams = { ...params, ...filters, page: 1 };
    setParams(newParams);
    searchLeads(newParams);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Lead Finder</h1>
        <p className="text-muted-foreground">
          Search verified B2B prospects for your outreach campaigns.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <LeadsSearch onSearch={handleSearch} />
        <LeadsFilter onFilter={handleFilter} currentFilters={params} />
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : !hasSearched ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-medium">Start your search</h3>
          <p className="text-sm text-muted-foreground">
            Enter a keyword, industry, or location and click Search to find B2B prospects.
          </p>
        </div>
      ) : leads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-medium">No leads found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Showing {leads.length} of {total} leads
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {leads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onClick={() => setSelectedLead(lead)}
              />
            ))}
          </div>
          {total > (params.limit || 12) && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                disabled={(params.page || 1) <= 1}
                onClick={() => {
                  const newParams = { ...params, page: (params.page || 1) - 1 };
                  setParams(newParams);
                  searchLeads(newParams);
                }}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={((params.page || 1) * (params.limit || 12)) >= total}
                onClick={() => {
                  const newParams = { ...params, page: (params.page || 1) + 1 };
                  setParams(newParams);
                  searchLeads(newParams);
                }}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      <LeadDetailSheet
        lead={selectedLead}
        open={!!selectedLead}
        onClose={() => setSelectedLead(null)}
      />
    </div>
  );
}
