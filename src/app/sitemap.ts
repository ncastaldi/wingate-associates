import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Public pages only. Add new routes here when they ship.
const PATHS = ["/", "/services", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((path) => ({ url: new URL(path, SITE_URL).toString() }));
}
