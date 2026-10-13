import { describe, expect, it } from "vitest";
import { parseEnv } from "@/lib/env";

const valid = {
  DATABASE_URL: "postgres://wingate:pw@localhost:5432/wingate",
  RESEND_API_KEY: "re_test",
  CONTACT_TO_EMAIL: "owner@example.com",
  CONTACT_FROM_EMAIL: "Wingate <noreply@example.com>",
};

describe("parseEnv", () => {
  it("returns the parsed values when everything is set", () => {
    expect(parseEnv(valid)).toEqual(valid);
  });

  it("names every missing variable in the error", () => {
    expect(() => parseEnv({ ...valid, RESEND_API_KEY: undefined, DATABASE_URL: "" })).toThrow(
      /DATABASE_URL.*RESEND_API_KEY|RESEND_API_KEY.*DATABASE_URL/,
    );
  });

  it("rejects a recipient that is not an email address", () => {
    expect(() => parseEnv({ ...valid, CONTACT_TO_EMAIL: "not-an-email" })).toThrow(
      /CONTACT_TO_EMAIL/,
    );
  });

  it("does not leak secret values into the error message", () => {
    let message = "";
    try {
      parseEnv({ ...valid, CONTACT_TO_EMAIL: "re_secret_value" });
    } catch (error) {
      message = (error as Error).message;
    }
    expect(message).toMatch(/CONTACT_TO_EMAIL/);
    expect(message).not.toContain("re_secret_value");
  });
});
