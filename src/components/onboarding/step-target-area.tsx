"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Step2Data } from "@/lib/validations/schemas";

interface StepTargetAreaProps {
  data: Partial<Step2Data>;
  onChange: (data: Partial<Step2Data>) => void;
  errors?: Record<string, string[]>;
}

export function StepTargetArea({ data, onChange, errors }: StepTargetAreaProps) {
  const update = (field: keyof Step2Data) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange({ ...data, [field]: e.target.value });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="target_customer">Who is your ideal customer? *</Label>
        <Textarea
          id="target_customer"
          value={data.target_customer || ""}
          onChange={update("target_customer")}
          placeholder="Office managers and facility directors at mid-size companies (50-500 employees) who need regular commercial cleaning..."
          rows={3}
        />
        {errors?.target_customer && (
          <p className="mt-1 text-sm text-destructive">{errors.target_customer[0]}</p>
        )}
      </div>

      <div>
        <Label htmlFor="service_area">Service Area *</Label>
        <Input
          id="service_area"
          value={data.service_area || ""}
          onChange={update("service_area")}
          placeholder="Greater Chicago area, IL"
        />
        {errors?.service_area && (
          <p className="mt-1 text-sm text-destructive">{errors.service_area[0]}</p>
        )}
      </div>

      <div>
        <Label htmlFor="value_proposition">Value Proposition</Label>
        <Textarea
          id="value_proposition"
          value={data.value_proposition || ""}
          onChange={update("value_proposition")}
          placeholder="Eco-friendly cleaning that makes your office shine — guaranteed satisfaction or your money back"
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="preferred_cta">Preferred Call to Action</Label>
        <Input
          id="preferred_cta"
          value={data.preferred_cta || ""}
          onChange={update("preferred_cta")}
          placeholder="Schedule a free walkthrough"
        />
      </div>

      <div>
        <Label htmlFor="custom_pitch_line">Custom Pitch Line</Label>
        <Input
          id="custom_pitch_line"
          value={data.custom_pitch_line || ""}
          onChange={update("custom_pitch_line")}
          placeholder="We've helped over 200 offices reduce costs by 30%..."
        />
      </div>
    </div>
  );
}
