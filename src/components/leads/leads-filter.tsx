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
import { DEMO_LEADS } from "@/lib/leads/demo-data";

const INDUSTRIES = [
  "Commercial Cleaning",
  "Construction",
  "Freight/Logistics",
  "Insurance",
  "Junk Removal",
  "Pressure Washing",
  "Real Estate",
  "Roofing",
];

const BUSINESS_SIZES = ["1-5", "5-50", "50-200", "200+"];

const STATES = Array.from(new Set(DEMO_LEADS.map((l) => l.state))).sort();

const CITIES = Array.from(new Set(DEMO_LEADS.map((l) => l.city).filter(Boolean))).sort();

interface LeadsFilterProps {
  onFilter: (filters: Partial<LeadSearchParams>) => void;
  currentFilters: LeadSearchParams;
}

export function LeadsFilter({ onFilter, currentFilters }: LeadsFilterProps) {
  const activeCount = [
    currentFilters.industry,
    currentFilters.state,
    currentFilters.city,
    currentFilters.business_size,
  ].filter(Boolean).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
          {activeCount > 0 && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {activeCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 z-[100] max-h-[70vh] overflow-y-auto" align="end">
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
        <DropdownMenuLabel>City</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={currentFilters.city || ""}
          onValueChange={(v) => onFilter({ city: v || undefined })}
        >
          <DropdownMenuRadioItem value="">All Cities</DropdownMenuRadioItem>
          {CITIES.map((city) => (
            <DropdownMenuRadioItem key={city} value={city}>
              {city}
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
