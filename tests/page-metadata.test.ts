import { describe, expect, it } from "vitest";
import { pageMetadata } from "@/lib/page-metadata";

describe("pageMetadata", () => {
  it("suffixes the site name and keeps title, canonical and Open Graph in step", () => {
    const meta = pageMetadata({ title: "Services", description: "What we do.", path: "/services" });
    expect(meta.title).toEqual({ absolute: "Services | Wingate Associates" });
    expect(meta.alternates).toEqual({ canonical: "/services" });
    expect(meta.openGraph).toMatchObject({
      title: "Services | Wingate Associates",
      description: "What we do.",
      url: "/services",
      siteName: "Wingate Associates",
    });
    expect(meta.twitter).toMatchObject({ card: "summary_large_image" });
  });

  it("uses the bare site name when there is no page title", () => {
    expect(pageMetadata({ description: "Home.", path: "/" }).title).toEqual({
      absolute: "Wingate Associates",
    });
  });

  it("sets no canonical or Open Graph URL without a path, so layouts do not leak one", () => {
    const meta = pageMetadata({ description: "Default." });
    expect(meta.alternates).toBeUndefined();
    expect(meta.openGraph).not.toHaveProperty("url");
  });
});
