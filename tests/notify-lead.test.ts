import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ACKNOWLEDGEMENT_HTML,
  ACKNOWLEDGEMENT_PARAGRAPHS,
  ACKNOWLEDGEMENT_TEXT,
} from "@/lib/acknowledgement-email";
import { sendLeadAcknowledgement, sendLeadNotification, type EmailSender } from "@/lib/notify-lead";

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

describe("sendLeadAcknowledgement", () => {
  it("sends to the visitor, with replies going to the owner", async () => {
    const send = vi.fn<EmailSender>().mockResolvedValue({ error: null });
    await sendLeadAcknowledgement(lead, send);
    expect(send).toHaveBeenCalledOnce();
    expect(send.mock.calls[0][0]).toMatchObject({
      from: "Wingate <noreply@example.com>",
      to: "ada@example.com",
      replyTo: "owner@example.com",
      subject: "Thank you for reaching out!",
      text: ACKNOWLEDGEMENT_TEXT,
      html: ACKNOWLEDGEMENT_HTML,
    });
  });

  it("echoes nothing the visitor typed, so the form cannot mail arbitrary text", async () => {
    const send = vi.fn<EmailSender>().mockResolvedValue({ error: null });
    await sendLeadAcknowledgement(
      { name: "Buy pills at spam.example", email: "victim@example.com", message: "spam body" },
      send,
    );
    const payload = JSON.stringify(send.mock.calls[0][0]);
    expect(payload).not.toContain("spam.example");
    expect(payload).not.toContain("spam body");
  });

  it("keeps to the owner's voice: no em dashes and no question marks", () => {
    for (const version of [ACKNOWLEDGEMENT_TEXT, ACKNOWLEDGEMENT_HTML]) {
      expect(version).not.toContain("\u2014");
    }
    expect(ACKNOWLEDGEMENT_TEXT).not.toContain("?");
  });

  it("carries every paragraph in both the text and HTML versions", () => {
    for (const paragraph of ACKNOWLEDGEMENT_PARAGRAPHS) {
      expect(ACKNOWLEDGEMENT_TEXT).toContain(paragraph);
      expect(ACKNOWLEDGEMENT_HTML).toContain(paragraph);
    }
  });

  it("loads nothing from third parties: no tracking pixels, only the site's own logo", () => {
    const sources = [...ACKNOWLEDGEMENT_HTML.matchAll(/src="([^"]+)"/g)].map((m) => m[1]);
    expect(sources).toEqual(["https://wingate.associates/logo-mark.png"]);
  });

  it("throws when Resend reports an error", async () => {
    const send = vi.fn<EmailSender>().mockResolvedValue({ error: { message: "bad recipient" } });
    await expect(sendLeadAcknowledgement(lead, send)).rejects.toThrow(/bad recipient/);
  });
});
