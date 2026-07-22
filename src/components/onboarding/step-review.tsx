"use client";

import type { OnboardingFormData } from "@/lib/validations/schemas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StepReviewProps {
  data: Partial<OnboardingFormData>;
}

export function StepReview({ data }: StepReviewProps) {
  const sections = [
    {
      title: "Business Info",
      items: [
        { label: "Business Name", value: data.business_name },
        { label: "Your Name", value: data.user_display_name },
        { label: "Business Type", value: data.business_type },
        { label: "Primary Service", value: data.primary_service },
        { label: "Website", value: data.website },
        { label: "Phone", value: data.phone },
      ],
    },
    {
      title: "Target Area",
      items: [
        { label: "Ideal Customer", value: data.target_customer },
        { label: "Service Area", value: data.service_area },
        { label: "Value Proposition", value: data.value_proposition },
        { label: "Call to Action", value: data.preferred_cta },
        { label: "Pitch Line", value: data.custom_pitch_line },
      ],
    },
    {
      title: "Email Setup",
      items: [
        { label: "Signature", value: data.email_signature },
      ],
    },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Review your information before creating your workspace. You can change these settings later.
      </p>

      {sections.map((section) => (
        <Card key={section.title}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{section.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {section.items.map(
              (item) =>
                item.value && (
                  <div key={item.label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="max-w-[60%] truncate font-medium">{item.value}</span>
                  </div>
                )
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
