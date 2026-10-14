import { describe, expect, it } from "vitest";
import { parseDbEnv, parseEmailEnv } from "@/lib/env";

const db = { DATABASE_URL: "postgres://wingate:pw@localhost:5432/wingate" };
const email = {
  RESEND_API_KEY: "re_test",
  CONTACT_TO_EMAIL: "owner@example.com",
  CONTACT_FROM_EMAIL: "Wingate <noreply@example.com>",
};

describe("parseDbEnv", () => {
  it("returns DATABASE_URL when it is set", () => {
    expect(parseDbEnv(db)).toEqual(db);
  });

  it("ignores the email settings, so a bad one cannot block storing leads", () => {
    expect(parseDbEnv({ ...db, CONTACT_TO_EMAIL: "Wingate <owner@example.com>" })).toEqual(db);
  });

  it("names DATABASE_URL when it is missing", () => {
    expect(() => parseDbEnv({ DATABASE_URL: "" })).toThrow(/DATABASE_URL/);
  });
});

describe("parseEmailEnv", () => {
  it("returns the parsed values when everything is set", () => {
    expect(parseEmailEnv(email)).toEqual(email);
  });

  it("names every missing variable in the error", () => {
    expect(() =>
      parseEmailEnv({ ...email, RESEND_API_KEY: undefined, CONTACT_FROM_EMAIL: "" }),
    ).toThrow(/RESEND_API_KEY.*CONTACT_FROM_EMAIL|CONTACT_FROM_EMAIL.*RESEND_API_KEY/);
  });

  it("rejects a recipient in display-name form", () => {
    expect(() =>
      parseEmailEnv({ ...email, CONTACT_TO_EMAIL: "Wingate <owner@example.com>" }),
    ).toThrow(/CONTACT_TO_EMAIL/);
  });

  it("does not leak secret values into the error message", () => {
    let message = "";
    try {
      parseEmailEnv({ ...email, CONTACT_TO_EMAIL: "re_secret_value" });
    } catch (error) {
      message = (error as Error).message;
    }
    expect(message).toMatch(/CONTACT_TO_EMAIL/);
    expect(message).not.toContain("re_secret_value");
  });
});
