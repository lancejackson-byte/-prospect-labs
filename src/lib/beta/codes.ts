import { createHash, randomBytes } from "crypto";

export function generateBetaCode(): { prefix: string; hash: string; fullCode: string } {
  const raw = "beta-" + randomBytes(16).toString("hex");
  const prefix = raw.slice(0, 10);
  const hash = createHash("sha256").update(raw).digest("hex");
  return { prefix, hash, fullCode: raw };
}

export function hashCode(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

export function verifyCode(code: string, storedHash: string): boolean {
  return hashCode(code) === storedHash;
}
