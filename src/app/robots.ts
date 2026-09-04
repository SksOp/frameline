import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/site-origin";

export default function robots(): MetadataRoute.Robots {
  const origin = getSiteOrigin();
  return {
    rules: { userAgent: "*", allow: ["/", "/products", "/solutions", "/teleprompter"], disallow: ["/teleprompter/app"] },
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  };
}
