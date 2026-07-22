export interface EmailTemplateData {
  subject: string;
  body: string;
}

export interface TemplateVariables {
  company_name: string;
  contact_name: string;
  business_type: string;
  primary_service?: string;
  value_proposition?: string;
  custom_pitch?: string;
  service_area?: string;
  email_signature?: string;
}

export interface GenerateEmailParams {
  templateName: string;
  variables: TemplateVariables;
  tone?: "professional" | "casual" | "friendly";
  length?: "short" | "medium" | "long";
}

export interface AIProvider {
  generateEmail(params: GenerateEmailParams): Promise<EmailTemplateData>;
  personalizeTemplate(template: string, variables: TemplateVariables): Promise<string>;
}
