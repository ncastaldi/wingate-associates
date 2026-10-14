import { createRateLimiter } from "./rate-limit";

const HOUR = 60 * 60 * 1000;

// Per client: enough for a real person to correct and resend, not enough to flood.
export const PER_CLIENT_LIMIT = { limit: 5, windowMs: HOUR };
// Across all clients: bounds the stored rows and Resend emails per hour even
// when a sender rotates IP addresses.
export const OVERALL_LIMIT = { limit: 30, windowMs: HOUR };

export type LeadRateLimit = (clientKey: string, now?: number) => "ok" | "client" | "overall";

export function createLeadRateLimit(): LeadRateLimit {
  const perClient = createRateLimiter(PER_CLIENT_LIMIT);
  const overall = createRateLimiter(OVERALL_LIMIT);
  return (clientKey, now = Date.now()) => {
    if (!perClient.take(clientKey, now)) return "client";
    if (!overall.take("all", now)) return "overall";
    return "ok";
  };
}

export const checkLeadRateLimit = createLeadRateLimit();

// The site is reachable only through the Cloudflare Tunnel (CLAUDE.md
// constraint 2), and Cloudflare sets CF-Connecting-IP to the visitor's address,
// overwriting any value the client sent. Without it (local dev), every request
// shares one key and still counts toward the overall limit.
export function clientKeyFrom(requestHeaders: Headers): string {
  return requestHeaders.get("cf-connecting-ip")?.trim() || "unknown";
}
