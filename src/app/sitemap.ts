import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/site-origin";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: getSiteOrigin(), changeFrequency: "monthly", priority: 1 }];
}
