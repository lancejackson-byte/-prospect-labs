import { Search, Sparkles, Mail, BarChart3, Users, Shield } from "lucide-react";

const FEATURES = [
  {
    icon: Search,
    title: "Lead Discovery",
    description: "Search millions of verified B2B contacts. Filter by industry, location, company size, and more.",
  },
  {
    icon: Sparkles,
    title: "AI Email Generation",
    description: "Personalize outreach at scale with AI that writes compelling emails tailored to each prospect.",
  },
  {
    icon: Mail,
    title: "Smart Sequences",
    description: "Build multi-step email sequences with automated follow-ups that respect timing and cadence.",
  },
  {
    icon: BarChart3,
    title: "Visual CRM Pipeline",
    description: "Drag and drop deals through customizable stages. See your entire pipeline at a glance.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together with your sales team. Assign leads, share templates, and track progress.",
  },
  {
    icon: Shield,
    title: "Compliance Built-In",
    description: "CAN-SPAM compliant by default. Easy unsubscribe management and email suppression lists.",
  },
];

export function Features() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Everything You Need to Prospect Smarter</h2>
          <p className="mt-4 text-muted-foreground">
            Replace your fragmented stack of data brokers, email tools, and spreadsheets.
          </p>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="rounded-lg border p-6">
              <feature.icon className="mb-3 h-8 w-8 text-primary" />
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
