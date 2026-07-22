import type { LeadProvider } from "./types";
import { DemoLeadProvider } from "./demo-provider";

let cachedProvider: LeadProvider | null = null;

export function getLeadProvider(): LeadProvider {
  if (!cachedProvider) {
    // Always use demo provider for now
    // In production, switch based on env vars or subscription tier
    cachedProvider = new DemoLeadProvider();
  }
  return cachedProvider;
}
