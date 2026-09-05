import Link from "next/link";
import { ArrowRight, Focus, Gift, LockKeyhole, MonitorSmartphone, Zap } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { Item, ItemContent, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { ProductRail } from "@/features/studio/components/product-rail";
import { SolutionPillars } from "@/features/studio/components/solution-pillars";
import { StudioHero } from "@/features/studio/components/studio-hero";
import { StudioContainer, StudioSectionHeading, StudioShell } from "@/features/studio/components/studio-layout";
import { StudioPrinciples } from "@/features/studio/components/studio-principles";
import { StructuredData } from "@/features/studio/components/structured-data";
import { studioProducts } from "@/features/studio/product-catalog";
import { getSiteOrigin } from "@/lib/site-origin";

const promises = [
  { label: "Focused tools", icon: Focus },
  { label: "Private by default", icon: LockKeyhole },
  { label: "Client-side where possible", icon: MonitorSmartphone },
  { label: "Immediate access", icon: Zap },
  { label: "A free path", icon: Gift },
] as const;

export default function HomePage() {
  const origin = getSiteOrigin();
  return <>
    <StudioShell>
      <StudioHero />
      <ItemGroup render={<ul />} className="list-none flex-row flex-wrap justify-center gap-5 border-y border-divider bg-surface-strong px-(--content-gutter) py-4" aria-label="Studio promise">{promises.map(({ label, icon: Icon }) => <Item render={<li />} className="w-auto border-0 p-0 text-[0.8125rem] font-bold uppercase tracking-[0.04em] text-text-secondary" key={label}><ItemMedia><Icon className="size-4" aria-hidden="true" /></ItemMedia><ItemContent><ItemTitle className="text-[0.8125rem]">{label}</ItemTitle></ItemContent></Item>)}</ItemGroup>
      <StudioContainer className="py-24"><StudioSectionHeading eyebrow="From the studio" title="One useful tool today. More taking shape." titleId="collection-title" /><section aria-labelledby="collection-title"><ProductRail products={studioProducts} label="Frameline product collection" /></section></StudioContainer>
      <section className="bg-text-primary py-20 text-text-inverted" aria-labelledby="solutions-preview-title"><StudioContainer><StudioSectionHeading eyebrow="Why Frameline" title="Less ceremony. More making." titleId="solutions-preview-title" description="Focused jobs, client-side processing where practical, no-account entry, and a free path to start." tone="inverted" /><SolutionPillars compact /><Link className={cn(buttonVariants(), "mx-auto mt-8 flex w-fit border-surface bg-surface text-text-primary hover:bg-accent-gold")} href="/solutions">Explore our approach <ArrowRight data-icon="inline-end" aria-hidden="true" /></Link></StudioContainer></section>
      <StudioPrinciples />
      <StudioContainer className="py-24 text-center"><section aria-labelledby="closing-title"><p className="mb-3 text-[0.8125rem] font-[750] uppercase tracking-[0.08em] text-brand-coral-strong">Ready when you are</p><h2 className="mx-auto max-w-[16ch] font-display text-[clamp(2.75rem,6vw,5.5rem)] font-[560] leading-[0.92] tracking-[-0.05em]" id="closing-title">Your next useful tool is already open.</h2><p className="mx-auto mt-5 mb-7 max-w-152 leading-[1.6] text-text-secondary">Teleprompter is free to use now—no account, no upload, and no setup detour.</p><Link className={buttonVariants()} href="/products">See all products <ArrowRight data-icon="inline-end" aria-hidden="true" /></Link></section></StudioContainer>
    </StudioShell>
    <StructuredData value={{ "@context": "https://schema.org", "@type": "Organization", name: "Frameline", url: origin, description: "Focused creator tools with private, immediate, client-side workflows and a free path to start." }} />
  </>;
}
