import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { ProductRail } from "@/features/studio/components/product-rail";
import { SolutionPillars } from "@/features/studio/components/solution-pillars";
import { StructuredData } from "@/features/studio/components/structured-data";
import { StudioFooter } from "@/features/studio/components/studio-footer";
import { StudioNavigation } from "@/features/studio/components/studio-navigation";
import { studioProducts } from "@/features/studio/product-catalog";
import { studioSolutions } from "@/features/studio/studio-solutions";
import { getSiteOrigin } from "@/lib/site-origin";
import "@/features/studio/studio.css";

const title = "Private, immediate creator tools";
const description =
  "See how Frameline approaches focused creative work: private by default, client-side where practical, immediate to open, and free to start.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/solutions" },
  openGraph: {
    title: `${title} · Frameline`,
    description,
    type: "website",
    url: "/solutions",
    siteName: "Frameline",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Frameline creator studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} · Frameline`,
    description,
    images: ["/opengraph-image"],
  },
};

export default function SolutionsPage() {
  const origin = getSiteOrigin();

  return (
    <div className="studio-site">
      <StudioNavigation />
      <main>
        <section className="studio-main studio-page-hero studio-solutions-hero">
          <p className="studio-eyebrow">Why Frameline</p>
          <h1 className="studio-title">Creative tools without the usual tollbooths.</h1>
          <p className="studio-lede">
            Use one focused tool, finish one job, and move on. Frameline is built around privacy,
            client-side work where practical, immediate access, and a free way to begin.
          </p>
          <ul className="studio-inline-facts" aria-label="Frameline principles">
            <li><Check aria-hidden="true" /> No account for available tools</li>
            <li><Check aria-hidden="true" /> Product-specific privacy boundaries</li>
            <li><Check aria-hidden="true" /> Honest availability</li>
          </ul>
        </section>
        <section className="studio-solutions-body" aria-labelledby="solution-pillars-title">
          <div className="studio-main">
            <div className="studio-section-heading">
              <div><p className="studio-eyebrow">The operating model</p><h2 id="solution-pillars-title">Less ceremony. More making.</h2></div>
              <p>These are product decisions, not slogans. Each claim is bounded by what the available tool can prove today.</p>
            </div>
            <SolutionPillars />
          </div>
        </section>
        <section className="studio-main studio-solutions-products" aria-labelledby="solutions-products-title">
          <div className="studio-section-heading">
            <div><p className="studio-eyebrow">Where it shows up</p><h2 id="solutions-products-title">One live proof. Three directions.</h2></div>
            <p>Teleprompter is available. Everything else is a working concept until its real workflow and browser boundary are proven.</p>
          </div>
          <ProductRail products={studioProducts} label="Products related to Frameline's approach" />
        </section>
        <section className="studio-main studio-closing" aria-labelledby="solutions-closing-title">
          <p className="studio-eyebrow">Available now</p>
          <h2 id="solutions-closing-title">Put the approach to work.</h2>
          <p>Teleprompter runs without an account and prepares your prompt video on your device.</p>
          <Link className="studio-button" href="/teleprompter/app">Open Teleprompter <ArrowRight aria-hidden="true" /></Link>
        </section>
      </main>
      <StudioFooter />
      <StructuredData value={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: title,
        description,
        url: `${origin}/solutions`,
        about: studioSolutions.map((solution) => ({ "@type": "Thing", name: solution.name, description: solution.description })),
      }} />
    </div>
  );
}
