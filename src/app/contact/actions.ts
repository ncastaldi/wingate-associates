"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { getDb } from "@/db";
import { leads } from "@/db/schema";
import { HONEYPOT_FIELD, leadSchema } from "@/lib/lead-schema";
import { checkLeadRateLimit, clientKeyFrom } from "@/lib/lead-rate-limit";
import { sendLeadAcknowledgement, sendLeadNotification } from "@/lib/notify-lead";

export type SubmitLeadResult =
  | { ok: true }
  | { ok: false; fieldErrors?: Record<string, string[] | undefined>; formError?: string };

const RATE_LIMITED_MESSAGE =
  "Too many messages have been sent recently. Please try again in an hour.";

export async function submitLead(formData: FormData): Promise<SubmitLeadResult> {
  // Report success without storing or emailing, so a bot learns nothing from the response.
  if (formData.get(HONEYPOT_FIELD)) return { ok: true };

  const parsed = leadSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { ok: false, fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  // Only submissions that would store a lead and send an email count.
  const limited = checkLeadRateLimit(clientKeyFrom(await headers()));
  if (limited !== "ok") {
    console.warn(`Lead rate limited (${limited})`);
    return { ok: false, formError: RATE_LIMITED_MESSAGE };
  }

  try {
    await getDb().insert(leads).values(parsed.data);
  } catch (error) {
    console.error("Lead insert failed", error);
    return { ok: false, formError: "Something went wrong. Please try again." };
  }

  // The lead is already stored, so a failed email must not fail the submission. The owner
  // notification and the visitor's acknowledgement are independent: one failing does not
  // stop the other.
  const [notification, acknowledgement] = await Promise.allSettled([
    sendLeadNotification(parsed.data),
    sendLeadAcknowledgement(parsed.data),
  ]);
  if (notification.status === "rejected") {
    console.error("Lead notification failed", notification.reason);
  }
  if (acknowledgement.status === "rejected") {
    console.error("Lead acknowledgement failed", acknowledgement.reason);
  }

  return { ok: true };
}
