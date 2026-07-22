"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";
import type { LeadSearchParams } from "@/lib/leads/types";

const INDUSTRIES = [
  "Property Management",
  "Logistics",
  "Construction",
  "Insurance",
  "Recruiting",
  "Commercial Cleaning",
  "Real Estate",
  "Marketing",
];

const BUSINESS_SIZES = ["1-5", "5-50", "50-200", "200+"];

const STATES = [
  "AZ", "CA", "CO", "DC", "FL", "GA", "IL", "MA", "MN", "NV", "NY", "OR", "SC", "TX", "VA", "WA",
];

interface LeadsFilterProps {
  onFilter: (filters: Partial<LeadSearchParams>) => void;
  currentFilters: LeadSearchParams;
}

export function LeadsFilter({ onFilter, currentFilters }: LeadsFilterProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
          {(currentFilters.industry || currentFilters.state || currentFilters.business_size) && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {[currentFilters.industry, currentFilters.state, currentFilters.business_size].filter(Boolean).length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>Industry</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={currentFilters.industry || ""}
          onValueChange={(v) => onFilter({ industry: v || undefined })}
        >
          <DropdownMenuRadioItem value="">All Industries</DropdownMenuRadioItem>
          {INDUSTRIES.map((ind) => (
            <DropdownMenuRadioItem key={ind} value={ind}>
              {ind}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>State</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={currentFilters.state || ""}
          onValueChange={(v) => onFilter({ state: v || undefined })}
        >
          <DropdownMenuRadioItem value="">All States</DropdownMenuRadioItem>
          {STATES.map((st) => (
            <DropdownMenuRadioItem key={st} value={st}>
              {st}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Company Size</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={currentFilters.business_size || ""}
          onValueChange={(v) => onFilter({ business_size: v || undefined })}
        >
          <DropdownMenuRadioItem value="">All Sizes</DropdownMenuRadioItem>
          {BUSINESS_SIZES.map((sz) => (
            <DropdownMenuRadioItem key={sz} value={sz}>
              {sz} employees
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
