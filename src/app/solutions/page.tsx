import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Item, ItemContent, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { ProductRail } from "@/features/studio/components/product-rail";
import { SolutionPillars } from "@/features/studio/components/solution-pillars";
import { StudioContainer, StudioPageHero, StudioSectionHeading, StudioShell } from "@/features/studio/components/studio-layout";
import { StructuredData } from "@/features/studio/components/structured-data";
import { studioProducts } from "@/features/studio/product-catalog";
import { studioSolutions } from "@/features/studio/studio-solutions";
import { getSiteOrigin } from "@/lib/site-origin";

const title = "Private, immediate creator tools";
const description = "See how Frameline approaches focused creative work: private by default, client-side where practical, immediate to open, and free to start.";
export const metadata: Metadata = { title, description, alternates: { canonical: "/solutions" }, openGraph: { title: `${title} · Frameline`, description, type: "website", url: "/solutions", siteName: "Frameline", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Frameline creator studio" }] }, twitter: { card: "summary_large_image", title: `${title} · Frameline`, description, images: ["/opengraph-image"] } };

export default function SolutionsPage() {
  const origin = getSiteOrigin();
  return <>
    <StudioShell>
      <StudioPageHero eyebrow="Why Frameline" title="Creative tools without the usual tollbooths." titleId="solutions-title" lede="Use one focused tool, finish one job, and move on. Frameline is built around privacy, client-side work where practical, immediate access, and a free way to begin.">
        <ItemGroup render={<ul />} className="mt-7 list-none flex-row flex-wrap gap-3" aria-label="Frameline principles">{["No account for available tools", "Product-specific privacy boundaries", "Honest availability"].map((fact) => <Item render={<li />} className="w-auto border-0 p-0" key={fact}><ItemMedia><Check className="size-4 text-positive" aria-hidden="true" /></ItemMedia><ItemContent><ItemTitle>{fact}</ItemTitle></ItemContent></Item>)}</ItemGroup>
      </StudioPageHero>
      <section className="bg-surface-strong py-20" aria-labelledby="solution-pillars-title"><StudioContainer><StudioSectionHeading eyebrow="The operating model" title="Less ceremony. More making." titleId="solution-pillars-title" description="These are product decisions, not slogans. Each claim is bounded by what the available tool can prove today." /><SolutionPillars /></StudioContainer></section>
      <StudioContainer className="py-20"><section aria-labelledby="solutions-products-title"><StudioSectionHeading eyebrow="Where it shows up" title="One live proof. Two directions." titleId="solutions-products-title" description="Teleprompter is available. Everything else is a working concept until its real workflow and browser boundary are proven." /><ProductRail products={studioProducts} label="Products related to Frameline's approach" /></section></StudioContainer>
      <StudioContainer className="py-24 text-center"><section aria-labelledby="solutions-closing-title"><p className="mb-3 text-[0.8125rem] font-[750] uppercase tracking-[0.08em] text-brand-coral-strong">Available now</p><h2 className="mx-auto max-w-[16ch] font-display text-[clamp(2.75rem,6vw,5.5rem)] font-[560] leading-[0.92] tracking-[-0.05em]" id="solutions-closing-title">Put the approach to work.</h2><p className="mx-auto mt-5 mb-7 max-w-152 leading-[1.6] text-text-secondary">Teleprompter runs without an account and prepares your prompt video on your device.</p><Link className={buttonVariants()} href="/studio">Open Studio <ArrowRight data-icon="inline-end" aria-hidden="true" /></Link></section></StudioContainer>
    </StudioShell>
    <StructuredData value={{ "@context": "https://schema.org", "@type": "WebPage", name: title, description, url: `${origin}/solutions`, about: studioSolutions.map((solution) => ({ "@type": "Thing", name: solution.name, description: solution.description })) }} />
  </>;
}
