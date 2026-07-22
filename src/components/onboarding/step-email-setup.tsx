"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Step3Data } from "@/lib/validations/schemas";

interface StepEmailSetupProps {
  data: Partial<Step3Data>;
  onChange: (data: Partial<Step3Data>) => void;
}

export function StepEmailSetup({ data, onChange }: StepEmailSetupProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="email_signature">Email Signature</Label>
        <Textarea
          id="email_signature"
          value={data.email_signature || ""}
          onChange={(e) => onChange({ email_signature: e.target.value })}
          placeholder="John Smith\nAcme Commercial Cleaning\n(555) 123-4567 | acme.com"
          rows={4}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          This will be appended to all AI-generated emails. You can add email integration (Gmail/SMTP) after setup.
        </p>
      </div>
    </div>
  );
}
