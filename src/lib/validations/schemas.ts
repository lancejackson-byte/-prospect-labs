import { z } from "zod";

export const step1BusinessInfoSchema = z.object({
  business_name: z.string().min(1, "Business name is required"),
  user_display_name: z.string().min(1, "Your name is required"),
  business_type: z.string().min(1, "Business type is required"),
  primary_service: z.string().min(1, "Primary service is required"),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
});

export const step2TargetAreaSchema = z.object({
  target_customer: z.string().min(1, "Target customer description is required"),
  service_area: z.string().min(1, "Service area is required"),
  value_proposition: z.string().optional().or(z.literal("")),
  preferred_cta: z.string().optional().or(z.literal("")),
  custom_pitch_line: z.string().optional().or(z.literal("")),
});

export const step3EmailSetupSchema = z.object({
  email_signature: z.string().optional().or(z.literal("")),
});

export const step4ReviewSchema = z.object({});

export const onboardingFormSchema = step1BusinessInfoSchema
  .merge(step2TargetAreaSchema)
  .merge(step3EmailSetupSchema);

export type OnboardingFormData = z.infer<typeof onboardingFormSchema>;
export type Step1Data = z.infer<typeof step1BusinessInfoSchema>;
export type Step2Data = z.infer<typeof step2TargetAreaSchema>;
export type Step3Data = z.infer<typeof step3EmailSetupSchema>;
