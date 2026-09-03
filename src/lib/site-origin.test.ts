import { afterEach, describe, expect, it, vi } from "vitest";
import { getSiteOrigin } from "./site-origin";

describe("getSiteOrigin", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("uses NEXT_PUBLIC_SITE_URL when it is a public origin", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://preview.example.com/");
    expect(getSiteOrigin()).toBe("https://preview.example.com");
  });

  it("ignores localhost fallbacks and uses the production origin", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:4444");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");
    expect(getSiteOrigin()).toBe("https://frameline.sksop.in");
  });

  it("uses the Vercel production domain when no explicit site URL is set", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "frameline.sksop.in");
    expect(getSiteOrigin()).toBe("https://frameline.sksop.in");
  });
});
