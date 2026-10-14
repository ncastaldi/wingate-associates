import { Resend } from "resend";
import { getEmailEnv } from "./env";

export type Lead = { name: string; email: string; message: string };

type SendResult = { error: { message: string } | null };
type EmailPayload = {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
  html: string;
};
export type EmailSender = (payload: EmailPayload) => Promise<SendResult>;

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const oneLine = (value: string) => value.replace(/\s+/g, " ").trim();

function resendSender(): EmailSender {
  const resend = new Resend(getEmailEnv().RESEND_API_KEY);
  return (payload) => resend.emails.send(payload);
}

// Resend reports failures in the response rather than throwing; this throws so callers can catch.
export async function sendLeadNotification(
  lead: Lead,
  send: EmailSender = resendSender(),
): Promise<void> {
  const env = getEmailEnv();
  const { error } = await send({
    from: env.CONTACT_FROM_EMAIL,
    to: env.CONTACT_TO_EMAIL,
    replyTo: lead.email,
    subject: `New lead: ${oneLine(lead.name)}`,
    text: `Name: ${lead.name}\nEmail: ${lead.email}\n\n${lead.message}`,
    html: `<p><strong>Name:</strong> ${escapeHtml(lead.name)}<br><strong>Email:</strong> ${escapeHtml(lead.email)}</p><p>${escapeHtml(lead.message).replaceAll("\n", "<br>")}</p>`,
  });
  if (error) {
    throw new Error(`Lead notification failed: ${error.message}`);
  }
}

// The acknowledgement goes to whatever address a visitor typed, so its content is fixed:
// nothing the visitor entered (not even their name) is echoed back. That keeps the form
// from being usable to mail arbitrary text to strangers. Replies reach the owner.
export const ACKNOWLEDGEMENT_SUBJECT = "Got your message";
export const ACKNOWLEDGEMENT_TEXT = [
  "Thanks for writing in. Your message reached me, and I read every one myself.",
  "I'll reply by email. If you want to add anything before then, reply to this one.",
  "",
  "Nathan Castaldi",
  "Wingate Associates",
  "https://wingate.associates",
].join("\n");

export async function sendLeadAcknowledgement(
  lead: Lead,
  send: EmailSender = resendSender(),
): Promise<void> {
  const env = getEmailEnv();
  const paragraphs = ACKNOWLEDGEMENT_TEXT.split("\n\n");
  const { error } = await send({
    from: env.CONTACT_FROM_EMAIL,
    to: lead.email,
    replyTo: env.CONTACT_TO_EMAIL,
    subject: ACKNOWLEDGEMENT_SUBJECT,
    text: ACKNOWLEDGEMENT_TEXT,
    html: paragraphs.map((p) => `<p>${p.replaceAll("\n", "<br>")}</p>`).join(""),
  });
  if (error) {
    throw new Error(`Lead acknowledgement failed: ${error.message}`);
  }
}
