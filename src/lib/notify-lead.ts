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
