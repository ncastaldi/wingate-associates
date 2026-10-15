import { beforeEach, describe, expect, it, vi } from "vitest";

const values = vi.fn();
const insert = vi.fn(() => ({ values }));
const sendLeadNotification = vi.fn();
const sendLeadAcknowledgement = vi.fn();
const checkLeadRateLimit = vi.fn();
const requestHeaders = new Headers({ "cf-connecting-ip": "203.0.113.7" });

vi.mock("@/db", () => ({ getDb: () => ({ insert }) }));
vi.mock("@/lib/notify-lead", () => ({ sendLeadNotification, sendLeadAcknowledgement }));
vi.mock("next/headers", () => ({ headers: async () => requestHeaders }));
vi.mock("@/lib/lead-rate-limit", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/lead-rate-limit")>()),
  checkLeadRateLimit,
}));

const { submitLead } = await import("@/app/contact/actions");
const { leads } = await import("@/db/schema");

function form(fields: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

const valid = { name: " Ada Lovelace ", email: "ada@example.com", message: "Hello there" };
const stored = { name: "Ada Lovelace", email: "ada@example.com", message: "Hello there" };

beforeEach(() => {
  vi.clearAllMocks();
  values.mockResolvedValue(undefined);
  sendLeadNotification.mockResolvedValue(undefined);
  sendLeadAcknowledgement.mockResolvedValue(undefined);
  checkLeadRateLimit.mockReturnValue("ok");
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

describe("submitLead", () => {
  it("stores the trimmed lead, notifies the owner and reports success", async () => {
    await expect(submitLead(form(valid))).resolves.toEqual({ ok: true });
    expect(insert).toHaveBeenCalledWith(leads);
    expect(values).toHaveBeenCalledWith(stored);
    expect(sendLeadNotification).toHaveBeenCalledWith(stored);
    expect(sendLeadAcknowledgement).toHaveBeenCalledWith(stored);
  });

  it("pretends to succeed but stores and sends nothing when the honeypot is filled", async () => {
    await expect(submitLead(form({ ...valid, website: "http://spam.example" }))).resolves.toEqual({
      ok: true,
    });
    expect(insert).not.toHaveBeenCalled();
    expect(sendLeadNotification).not.toHaveBeenCalled();
    expect(sendLeadAcknowledgement).not.toHaveBeenCalled();
  });

  it("accepts an empty honeypot as a normal submission", async () => {
    await expect(submitLead(form({ ...valid, website: "" }))).resolves.toEqual({ ok: true });
    expect(values).toHaveBeenCalledWith(stored);
  });

  it("returns field errors and does nothing else when input is invalid", async () => {
    const result = await submitLead(form({ ...valid, email: "nope" }));
    expect(result).toMatchObject({ ok: false, fieldErrors: { email: [expect.any(String)] } });
    expect(insert).not.toHaveBeenCalled();
    expect(sendLeadNotification).not.toHaveBeenCalled();
  });

  it("treats absent form fields as invalid", async () => {
    const result = await submitLead(new FormData());
    expect(result).toMatchObject({ ok: false });
    expect(insert).not.toHaveBeenCalled();
  });

  it("reports a generic error and sends no email when the insert fails", async () => {
    values.mockRejectedValue(new Error("connection refused"));
    const result = await submitLead(form(valid));
    expect(result).toEqual({ ok: false, formError: expect.any(String) });
    expect(JSON.stringify(result)).not.toContain("connection refused");
    expect(sendLeadNotification).not.toHaveBeenCalled();
    expect(sendLeadAcknowledgement).not.toHaveBeenCalled();
  });

  it("counts the submission against the visitor's Cloudflare-reported address", async () => {
    await submitLead(form(valid));
    expect(checkLeadRateLimit).toHaveBeenCalledWith("203.0.113.7");
  });

  it.each(["client", "overall"])(
    "stores and sends nothing when rate limited (%s)",
    async (scope) => {
      checkLeadRateLimit.mockReturnValue(scope);
      const result = await submitLead(form(valid));
      expect(result).toEqual({ ok: false, formError: expect.stringContaining("try again") });
      expect(insert).not.toHaveBeenCalled();
      expect(sendLeadNotification).not.toHaveBeenCalled();
      expect(sendLeadAcknowledgement).not.toHaveBeenCalled();
    },
  );

  it("does not count invalid or honeypot submissions against the limit", async () => {
    await submitLead(form({ ...valid, email: "nope" }));
    await submitLead(form({ ...valid, website: "http://spam.example" }));
    expect(checkLeadRateLimit).not.toHaveBeenCalled();
  });

  it("still succeeds when the notification fails, because the lead is stored", async () => {
    sendLeadNotification.mockRejectedValue(new Error("resend down"));
    await expect(submitLead(form(valid))).resolves.toEqual({ ok: true });
    expect(values).toHaveBeenCalledWith(stored);
  });

  it("still acknowledges the visitor when the owner notification fails", async () => {
    sendLeadNotification.mockRejectedValue(new Error("resend down"));
    await expect(submitLead(form(valid))).resolves.toEqual({ ok: true });
    expect(sendLeadAcknowledgement).toHaveBeenCalledWith(stored);
  });

  it("still succeeds when the acknowledgement fails", async () => {
    sendLeadAcknowledgement.mockRejectedValue(new Error("bad recipient"));
    await expect(submitLead(form(valid))).resolves.toEqual({ ok: true });
    expect(sendLeadNotification).toHaveBeenCalledWith(stored);
  });
});
