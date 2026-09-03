const PRODUCTION_ORIGIN = "https://frameline.sksop.in";

function normalizeOrigin(value: string | undefined): string | undefined {
  if (!value?.trim()) return undefined;
  const trimmed = value.trim();
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withProtocol);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname.endsWith(".local")) {
      return undefined;
    }
    return url.origin;
  } catch {
    return undefined;
  }
}

/** Public origin for canonical URLs, sitemap, and Open Graph tags. Never localhost. */
export function getSiteOrigin(): string {
  return (
    normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL) ??
    normalizeOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
    PRODUCTION_ORIGIN
  );
}
