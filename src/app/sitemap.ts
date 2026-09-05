import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/site-origin";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getSiteOrigin();
  return [
    { url: origin, changeFrequency: "monthly", priority: 1 },
    { url: `${origin}/studio`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${origin}/products`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${origin}/solutions`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${origin}/teleprompter`, changeFrequency: "monthly", priority: 0.9 },
  ];
}
