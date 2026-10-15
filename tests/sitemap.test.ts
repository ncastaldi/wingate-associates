import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";

describe("sitemap", () => {
  it("lists the public pages as absolute URLs on the canonical origin", () => {
    expect(sitemap().map((entry) => entry.url)).toEqual([
      "https://wingate.associates/",
      "https://wingate.associates/services",
      "https://wingate.associates/about",
      "https://wingate.associates/contact",
    ]);
  });
});
