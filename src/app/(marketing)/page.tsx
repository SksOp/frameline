import Link from "next/link";
import { ArrowRight, Focus, Gift, LockKeyhole, MonitorSmartphone, Zap } from "lucide-react";
import { ProductRail } from "@/features/studio/components/product-rail";
import { SolutionPillars } from "@/features/studio/components/solution-pillars";
import { StudioFooter } from "@/features/studio/components/studio-footer";
import { StudioHero } from "@/features/studio/components/studio-hero";
import { StudioNavigation } from "@/features/studio/components/studio-navigation";
import { StudioPrinciples } from "@/features/studio/components/studio-principles";
import { StructuredData } from "@/features/studio/components/structured-data";
import { studioProducts } from "@/features/studio/product-catalog";
import { getSiteOrigin } from "@/lib/site-origin";
import "@/features/studio/studio.css";

export default function HomePage() {
  const origin = getSiteOrigin();

  return (
    <div className="studio-site">
      <StudioNavigation />
      <main>
        <StudioHero />
        <section className="studio-band" aria-label="Studio promise">
          <span><Focus aria-hidden="true" /> Focused tools</span>
          <span><LockKeyhole aria-hidden="true" /> Private by default</span>
          <span><MonitorSmartphone aria-hidden="true" /> Client-side where possible</span>
          <span><Zap aria-hidden="true" /> Immediate access</span>
          <span><Gift aria-hidden="true" /> A free path</span>
        </section>
        <section className="studio-main studio-collection" aria-labelledby="collection-title">
          <div className="studio-section-heading">
            <div>
              <p className="studio-eyebrow">From the studio</p>
              <h2 id="collection-title">One useful tool today. More taking shape.</h2>
            </div>
            <p>
              Start with Teleprompter now, then preview the small, practical tools we are exploring next.
              Coming soon means direction—not a launch promise.
            </p>
          </div>
          <ProductRail products={studioProducts} label="Frameline product collection" />
        </section>
        <section className="studio-solutions-preview" aria-labelledby="solutions-preview-title">
          <div className="studio-main">
            <div className="studio-section-heading studio-section-heading--light">
              <div><p className="studio-eyebrow">Why Frameline</p><h2 id="solutions-preview-title">Less ceremony. More making.</h2></div>
              <p>Focused jobs, client-side processing where practical, no-account entry, and a free path to start.</p>
            </div>
            <SolutionPillars compact />
            <Link className="studio-button studio-button--light" href="/solutions">Explore our approach <ArrowRight aria-hidden="true" /></Link>
          </div>
        </section>
        <StudioPrinciples />
        <section className="studio-main studio-closing" aria-labelledby="closing-title">
          <p className="studio-eyebrow">Ready when you are</p>
          <h2 id="closing-title">Your next useful tool is already open.</h2>
          <p>Teleprompter is free to use now—no account, no upload, and no setup detour.</p>
          <Link className="studio-button" href="/products">
            See all products <ArrowRight aria-hidden="true" />
          </Link>
        </section>
      </main>
      <StudioFooter />
      <StructuredData value={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Frameline",
        url: origin,
        description: "Focused creator tools with private, immediate, client-side workflows and a free path to start.",
      }} />
    </div>
  );
}
