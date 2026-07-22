import type { AIProvider, GenerateEmailParams, EmailTemplateData, TemplateVariables } from "./types";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const SAMPLE_TEMPLATES: Record<string, string> = {
  outreach: `Hi {{contact_name}},\n\nI'm reaching out because {{company_name}} caught my attention as a leader in {{business_type}}. As someone who provides {{primary_service}}, I believe we could bring significant value to your operations.\n\n{{value_proposition}}\n\n{{custom_pitch}}\n\nWould you be open to a brief conversation to explore how we might help {{company_name}}?\n\nBest regards,\n{{email_signature}}`,
  follow_up: `Hi {{contact_name}},\n\nI wanted to follow up on my previous message. I understand how busy you must be at {{company_name}}.\n\nI genuinely believe our {{primary_service}} would make a difference for your team, especially in {{service_area}}.\n\n{{value_proposition}}\n\nLet me know if you'd like to chat for 10 minutes this week.\n\nBest,\n{{email_signature}}`,
  introduction: `Subject: Quick introduction — {{primary_service}} for {{company_name}}\n\nHi {{contact_name}},\n\nQuick introduction: I help {{business_type}} companies like {{company_name}} with {{primary_service}}.\n\n{{value_proposition}}\n\nIf this resonates, I'd love to share a few specific ideas for {{company_name}}.\n\n{{email_signature}}`,
};

export class DemoAIProvider implements AIProvider {
  async generateEmail(params: GenerateEmailParams): Promise<EmailTemplateData> {
    await delay(300);
    const template = SAMPLE_TEMPLATES[params.templateName] || SAMPLE_TEMPLATES.outreach;
    const body = await this.personalizeTemplate(template, params.variables);

    const subjectLines: Record<string, string> = {
      outreach: `${params.variables.primary_service || "Partnership"} for ${params.variables.company_name}`,
      follow_up: `Re: Following up with ${params.variables.company_name}`,
      introduction: `Quick introduction — ${params.variables.primary_service || "working together"}`,
    };

    return {
      subject: subjectLines[params.templateName] || `Connecting with ${params.variables.company_name}`,
      body,
    };
  }

  async personalizeTemplate(template: string, variables: TemplateVariables): Promise<string> {
    let result = template;
    const replacements: Record<string, string> = {
      "{{contact_name}}": variables.contact_name || "there",
      "{{company_name}}": variables.company_name || "your company",
      "{{business_type}}": variables.business_type || "your industry",
      "{{primary_service}}": variables.primary_service || "our services",
      "{{value_proposition}}": variables.value_proposition || "We deliver exceptional results for our clients.",
      "{{custom_pitch}}": variables.custom_pitch || "I'd love to discuss how we can support your goals.",
      "{{service_area}}": variables.service_area || "your area",
      "{{email_signature}}": variables.email_signature || "Best regards",
    };

    for (const [key, value] of Object.entries(replacements)) {
      result = result.replace(new RegExp(key.replace(/[{}()]/g, "\\$&"), "g"), value);
    }

    return result;
  }
}
