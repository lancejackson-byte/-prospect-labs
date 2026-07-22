"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Step1Data } from "@/lib/validations/schemas";

interface StepBusinessInfoProps {
  data: Partial<Step1Data>;
  onChange: (data: Partial<Step1Data>) => void;
  errors?: Record<string, string[]>;
}

export function StepBusinessInfo({ data, onChange, errors }: StepBusinessInfoProps) {
  const update = (field: keyof Step1Data) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange({ ...data, [field]: e.target.value });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="business_name">Business Name *</Label>
        <Input
          id="business_name"
          value={data.business_name || ""}
          onChange={update("business_name")}
          placeholder="Acme Commercial Cleaning"
        />
        {errors?.business_name && (
          <p className="mt-1 text-sm text-destructive">{errors.business_name[0]}</p>
        )}
      </div>

      <div>
        <Label htmlFor="user_display_name">Your Name *</Label>
        <Input
          id="user_display_name"
          value={data.user_display_name || ""}
          onChange={update("user_display_name")}
          placeholder="John Smith"
        />
        {errors?.user_display_name && (
          <p className="mt-1 text-sm text-destructive">{errors.user_display_name[0]}</p>
        )}
      </div>

      <div>
        <Label htmlFor="business_type">Business Type *</Label>
        <Input
          id="business_type"
          value={data.business_type || ""}
          onChange={update("business_type")}
          placeholder="Commercial Cleaning, Real Estate, Roofing..."
        />
        {errors?.business_type && (
          <p className="mt-1 text-sm text-destructive">{errors.business_type[0]}</p>
        )}
      </div>

      <div>
        <Label htmlFor="primary_service">Primary Service *</Label>
        <Textarea
          id="primary_service"
          value={data.primary_service || ""}
          onChange={update("primary_service")}
          placeholder="We provide commercial office cleaning services for businesses..."
          rows={3}
        />
        {errors?.primary_service && (
          <p className="mt-1 text-sm text-destructive">{errors.primary_service[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={data.website || ""}
            onChange={update("website")}
            placeholder="https://yourcompany.com"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={data.phone || ""}
            onChange={update("phone")}
            placeholder="(555) 123-4567"
          />
        </div>
      </div>
    </div>
  );
}
