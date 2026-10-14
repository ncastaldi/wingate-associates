import { describe, expect, it } from "vitest";
import robots from "@/app/robots";

describe("robots", () => {
  it("allows all crawlers and points at the sitemap on the canonical origin", () => {
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap: "https://wingate.associates/sitemap.xml",
    });
  });
});
