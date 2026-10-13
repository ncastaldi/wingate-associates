"use server";

import { z } from "zod";
import { getDb } from "@/db";
import { leads } from "@/db/schema";
import { leadSchema } from "@/lib/lead-schema";
import { sendLeadNotification } from "@/lib/notify-lead";

export type SubmitLeadResult =
  | { ok: true }
  | { ok: false; fieldErrors?: Record<string, string[] | undefined>; formError?: string };

export async function submitLead(formData: FormData): Promise<SubmitLeadResult> {
  const parsed = leadSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { ok: false, fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }

  try {
    await getDb().insert(leads).values(parsed.data);
  } catch (error) {
    console.error("Lead insert failed", error);
    return { ok: false, formError: "Something went wrong. Please try again." };
  }

  // The lead is already stored, so a failed notification must not fail the submission.
  try {
    await sendLeadNotification(parsed.data);
  } catch (error) {
    console.error("Lead notification failed", error);
  }

  return { ok: true };
}
