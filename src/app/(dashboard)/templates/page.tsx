"use client";

import { useState } from "react";
import { PRESET_TEMPLATES, generateEmail } from "@/lib/ai/template-engine";
import { TemplateCard } from "@/components/email/template-card";
import { EmailPreview } from "@/components/email/email-preview";
import type { TemplateVariables } from "@/lib/ai/types";

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [generated, setGenerated] = useState<{ subject: string; body: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const demoVars: TemplateVariables = {
    company_name: "Skyline Office Solutions",
    contact_name: "Michael Torres",
    business_type: "Property Management",
    primary_service: "Commercial Office Cleaning",
    value_proposition: "Eco-friendly cleaning that saves you 30% on facility costs.",
    custom_pitch: "We've helped 200+ offices in Chicago reduce their cleaning budget.",
    service_area: "Greater Chicago Area",
    email_signature: "John Smith\nAcme Commercial Cleaning\n(555) 123-4567",
  };

  async function handleGenerate(templateName: string) {
    setSelectedTemplate(templateName);
    setLoading(true);
    try {
      const result = await generateEmail({
        templateName,
        variables: demoVars,
      });
      setGenerated(result);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Email Templates</h1>
        <p className="text-muted-foreground">
          AI-powered email templates for your outreach campaigns.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {PRESET_TEMPLATES.map((tpl) => (
          <TemplateCard
            key={tpl.id}
            template={tpl}
            onGenerate={handleGenerate}
            isGenerating={loading && selectedTemplate === tpl.id}
          />
        ))}
      </div>

      {generated && (
        <EmailPreview
          subject={generated.subject}
          body={generated.body}
          onClose={() => setGenerated(null)}
        />
      )}
    </div>
  );
}
