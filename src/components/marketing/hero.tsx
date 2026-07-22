import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-5xl text-center">
        <div className="mb-6 inline-flex items-center rounded-full border bg-muted px-4 py-1.5 text-sm">
          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
          Trusted by 500+ B2B sales teams
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          Find Leads, Send AI Emails,{" "}
          <span className="text-primary">Close Deals</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          One platform to find verified B2B prospects, generate AI-personalized outreach,
          automate follow-ups, and track deals through a visual CRM pipeline.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button size="lg" asChild>
            <Link href="/signup">
              Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/pricing">View Plans</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
