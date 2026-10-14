import { describe, expect, it } from "vitest";
import {
  OVERALL_LIMIT,
  PER_CLIENT_LIMIT,
  clientKeyFrom,
  createLeadRateLimit,
} from "@/lib/lead-rate-limit";

describe("createLeadRateLimit", () => {
  it("refuses one client after its hourly allowance but still serves others", () => {
    const check = createLeadRateLimit();
    for (let i = 0; i < PER_CLIENT_LIMIT.limit; i++) expect(check("1.1.1.1", i)).toBe("ok");
    expect(check("1.1.1.1", 10)).toBe("client");
    expect(check("2.2.2.2", 11)).toBe("ok");
  });

  it("refuses everyone once the overall hourly cap is reached", () => {
    const check = createLeadRateLimit();
    for (let i = 0; i < OVERALL_LIMIT.limit; i++) expect(check(`10.0.0.${i}`, i)).toBe("ok");
    expect(check("10.0.1.1", 100)).toBe("overall");
  });

  it("allows a client again an hour later", () => {
    const check = createLeadRateLimit();
    for (let i = 0; i < PER_CLIENT_LIMIT.limit; i++) check("1.1.1.1", i);
    expect(check("1.1.1.1", PER_CLIENT_LIMIT.windowMs + PER_CLIENT_LIMIT.limit)).toBe("ok");
  });
});

describe("clientKeyFrom", () => {
  it("uses the address Cloudflare reports", () => {
    expect(clientKeyFrom(new Headers({ "cf-connecting-ip": " 203.0.113.7 " }))).toBe("203.0.113.7");
  });

  it("ignores X-Forwarded-For, which a client can set", () => {
    expect(clientKeyFrom(new Headers({ "x-forwarded-for": "203.0.113.7" }))).toBe("unknown");
  });
});
