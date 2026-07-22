import type { AIProvider, GenerateEmailParams, EmailTemplateData } from "./types";
import { DemoAIProvider } from "./demo-provider";

let cachedProvider: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (!cachedProvider) {
    cachedProvider = new DemoAIProvider();
  }
  return cachedProvider;
}

export async function generateEmail(params: GenerateEmailParams): Promise<EmailTemplateData> {
  const provider = getAIProvider();
  return provider.generateEmail(params);
}

export const PRESET_TEMPLATES = [
  {
    id: "outreach",
    name: "Cold Outreach",
    description: "Initial contact email for new prospects",
    tone: "professional",
    length: "medium",
  },
  {
    id: "follow_up",
    name: "Follow Up",
    description: "Gentle reminder after no response",
    tone: "friendly",
    length: "short",
  },
  {
    id: "introduction",
    name: "Quick Introduction",
    description: "Short and punchy intro email",
    tone: "casual",
    length: "short",
  },
];
