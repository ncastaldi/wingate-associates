import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sendLeadNotification, type EmailSender } from "@/lib/notify-lead";

const lead = { name: "Ada Lovelace", email: "ada@example.com", message: "Hello there" };

beforeEach(() => {
  vi.stubEnv("DATABASE_URL", "postgres://u:p@localhost:5432/db");
  vi.stubEnv("RESEND_API_KEY", "re_test");
  vi.stubEnv("CONTACT_TO_EMAIL", "owner@example.com");
  vi.stubEnv("CONTACT_FROM_EMAIL", "Wingate <noreply@example.com>");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("sendLeadNotification", () => {
  it("sends to the owner from the configured sender, with replies going to the lead", async () => {
    const send = vi.fn<EmailSender>().mockResolvedValue({ error: null });
    await sendLeadNotification(lead, send);
    expect(send).toHaveBeenCalledOnce();
    const payload = send.mock.calls[0][0];
    expect(payload).toMatchObject({
      from: "Wingate <noreply@example.com>",
      to: "owner@example.com",
      replyTo: "ada@example.com",
      subject: "New lead: Ada Lovelace",
    });
    expect(payload.text).toContain("Hello there");
  });

  it("escapes HTML in user-supplied fields", async () => {
    const send = vi.fn<EmailSender>().mockResolvedValue({ error: null });
    await sendLeadNotification(
      { ...lead, name: "<b>Eve</b>", message: '<script>alert("x")</script>' },
      send,
    );
    const { html } = send.mock.calls[0][0];
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<b>Eve</b>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("keeps line breaks out of the subject", async () => {
    const send = vi.fn<EmailSender>().mockResolvedValue({ error: null });
    await sendLeadNotification({ ...lead, name: "Eve\r\nBcc: x@evil.test" }, send);
    expect(send.mock.calls[0][0].subject).not.toMatch(/[\r\n]/);
  });

  it("throws when Resend reports an error", async () => {
    const send = vi.fn<EmailSender>().mockResolvedValue({ error: { message: "bad key" } });
    await expect(sendLeadNotification(lead, send)).rejects.toThrow(/bad key/);
  });
});
