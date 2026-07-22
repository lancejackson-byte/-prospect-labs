"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OnboardingProgress } from "./onboarding-progress";
import { StepBusinessInfo } from "./step-business-info";
import { StepTargetArea } from "./step-target-area";
import { StepEmailSetup } from "./step-email-setup";
import { StepReview } from "./step-review";
import { onboardingFormSchema } from "@/lib/validations/schemas";
import type { OnboardingFormData } from "@/lib/validations/schemas";
import { toast } from "sonner";

const TOTAL_STEPS = 4;

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<OnboardingFormData>>({});
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  function validateStep(stepNum: number): boolean {
    if (stepNum === 1) {
      const required = { business_name: data.business_name, user_display_name: data.user_display_name, business_type: data.business_type, primary_service: data.primary_service };
      const missing = Object.entries(required).filter(([, v]) => !v).map(([k]) => k);
      if (missing.length > 0) {
        setErrors(Object.fromEntries(missing.map((k) => [k, ["This field is required"]])));
        return false;
      }
    }
    if (stepNum === 2) {
      const required = { target_customer: data.target_customer, service_area: data.service_area };
      const missing = Object.entries(required).filter(([, v]) => !v).map(([k]) => k);
      if (missing.length > 0) {
        setErrors(Object.fromEntries(missing.map((k) => [k, ["This field is required"]])));
        return false;
      }
    }
    setErrors({});
    return true;
  }

  function handleNext() {
    if (!validateStep(step)) return;
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    }
  }

  function handleBack() {
    if (step > 1) {
      setStep(step - 1);
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    const result = onboardingFormSchema.safeParse(data);

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors as Record<string, string[]>);
      setSubmitting(false);
      toast.error("Please check your inputs for errors");
      return;
    }

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      const json = await res.json();

      if (!res.ok || json.error) {
        toast.error("Onboarding failed", { description: json.error || "Please try again" });
        setSubmitting(false);
        return;
      }

      toast.success("Workspace created! Redirecting to your dashboard...");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Set Up Your Workspace</h1>
        <p className="mt-2 text-muted-foreground">
          Tell us about your business so we can personalize your experience.
        </p>
      </div>

      <OnboardingProgress currentStep={step} totalSteps={TOTAL_STEPS} />

      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && "Business Information"}
            {step === 2 && "Target Market"}
            {step === 3 && "Email Setup"}
            {step === 4 && "Review & Confirm"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <StepBusinessInfo data={data} onChange={(d) => setData({ ...data, ...d })} errors={errors} />
          )}
          {step === 2 && (
            <StepTargetArea data={data} onChange={(d) => setData({ ...data, ...d })} errors={errors} />
          )}
          {step === 3 && (
            <StepEmailSetup data={data} onChange={(d) => setData({ ...data, ...d })} />
          )}
          {step === 4 && <StepReview data={data} />}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleBack} disabled={step === 1 || submitting}>
            Back
          </Button>
          {step < TOTAL_STEPS ? (
            <Button onClick={handleNext}>Continue</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Creating Workspace..." : "Create Workspace"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
