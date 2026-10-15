import { z } from "zod";

const bookingUrlSchema = z.string().url().startsWith("https://");

// Optional: unset until the self-hosted scheduler is running (ADR-006). Read per
// request, not cached, because the contact page renders on demand and the value
// is a runtime setting. An invalid value is treated as unset so a typo cannot
// break the contact page.
export function getBookingUrl(
  source: Record<string, string | undefined> = process.env,
): string | null {
  const raw = source.BOOKING_URL?.trim();
  if (!raw) return null;
  const result = bookingUrlSchema.safeParse(raw);
  return result.success ? result.data : null;
}
