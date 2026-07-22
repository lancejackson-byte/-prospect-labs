"use client";

import { useState } from "react";
import { PLANS } from "@/lib/billing/plans";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function BillingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleSubscribe(planId: string) {
    setLoading(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Stripe not configured. Demo mode active.");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Billing & Plans</h1>
        <p className="text-muted-foreground">
          Choose the plan that fits your business needs.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <Card key={plan.id} className={plan.id === "pro" ? "border-primary" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{plan.name}</CardTitle>
                {plan.id === "pro" && <Badge>Popular</Badge>}
              </div>
              <CardDescription>
                <span className="text-3xl font-bold text-foreground">${plan.monthlyPrice}</span>
                <span className="text-muted-foreground">/month</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    {f}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={plan.id === "pro" ? "default" : "outline"}
                disabled={loading === plan.id}
                onClick={() => handleSubscribe(plan.id)}
              >
                {loading === plan.id ? (
                  <>
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : plan.id === "pro" ? (
                  "Start Pro Trial"
                ) : plan.id === "agency" ? (
                  "Contact Sales"
                ) : (
                  "Get Started"
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Beta Code Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Redeem Beta Code</CardTitle>
          <CardDescription>
            Have a beta invite code? Enter it below to unlock pro access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BetaCodeRedeem />
        </CardContent>
      </Card>
    </div>
  );
}

function BetaCodeRedeem() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRedeem(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/beta/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(data.message);
        setCode("");
      }
    } catch {
      toast.error("Failed to redeem code");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleRedeem} className="flex gap-2">
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter beta code..."
        className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
      />
      <Button type="submit" disabled={loading || !code.trim()}>
        {loading ? "Redeeming..." : "Redeem"}
      </Button>
    </form>
  );
}
