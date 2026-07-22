import type { Step } from "react-joyride";

export interface TourStep extends Step {
  route?: string;
}

export const TOUR_STEPS: TourStep[] = [
  {
    target: 'a[href="/dashboard"]',
    title: "Dashboard",
    content:
      "Welcome to Prospect Labs! Here's your command center. View stats, recent activity, and quick actions.",
    placement: "right",
    disableBeacon: true,
    route: "/dashboard",
  },
  {
    target: 'a[href="/leads"]',
    title: "Lead Finder",
    content:
      "Find verified B2B prospects. Search by industry, location, and company size. Reveal leads using credits.",
    placement: "right",
    route: "/leads",
  },
  {
    target: 'a[href="/crm"]',
    title: "CRM Pipeline",
    content:
      "Track deals through your visual pipeline. Drag and drop opportunities between stages.",
    placement: "right",
    route: "/crm",
  },
  {
    target: 'a[href="/campaigns"]',
    title: "Campaigns",
    content:
      "Create multi-step outreach campaigns. Build sequences, set follow-ups, and automate your flow.",
    placement: "right",
    route: "/campaigns",
  },
  {
    target: 'a[href="/templates"]',
    title: "AI Templates",
    content:
      "Generate AI-personalized email templates. Choose tone, length, and customize your message.",
    placement: "right",
    route: "/templates",
  },
  {
    target: 'a[href="/analytics"]',
    title: "Analytics",
    content:
      "Monitor your performance. Track pipeline velocity, emails sent, and conversion rates.",
    placement: "right",
    route: "/analytics",
  },
  {
    target: 'a[href="/admin"]',
    title: "Admin Panel",
    content:
      "Manage beta codes, view billing, and configure workspace settings. You're the owner!",
    placement: "right",
    route: "/admin",
  },
];

export const TOUR_LOCALSTORAGE_KEY = "prospect-labs-tour-completed";
