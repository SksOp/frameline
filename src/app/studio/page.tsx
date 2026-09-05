import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, MonitorSmartphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FramelineMark } from "@/features/studio/components/frameline-logo";
import { StudioContainer, StudioPageHero, StudioShell } from "@/features/studio/components/studio-layout";
import { StructuredData } from "@/features/studio/components/structured-data";
import { availableProducts } from "@/features/studio/product-catalog";
import { getSiteOrigin } from "@/lib/site-origin";

const title = "Studio";
const description = "Open the creator tools currently available from Frameline Studio.";
export const metadata: Metadata = { title, description, alternates: { canonical: "/studio" }, openGraph: { title: `${title} · Frameline`, description, type: "website", url: "/studio", siteName: "Frameline", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Frameline creator studio" }] }, twitter: { card: "summary_large_image", title: `${title} · Frameline`, description, images: ["/opengraph-image"] } };

export default function StudioPage() {
  const origin = getSiteOrigin();
  return <>
    <StudioShell mainClassName="pb-24">
      <StudioPageHero eyebrow="Your creator studio" title="Pick a tool. Start making." titleId="studio-title" lede="This is the home for Frameline apps you can use right now. More focused tools will join the shelf when they are ready." />
      <StudioContainer className="py-8">
        <section aria-labelledby="available-apps-title">
          <div className="mb-6 flex flex-col items-start justify-between gap-5 min-[42.001rem]:flex-row min-[42.001rem]:items-end">
            <div><p className="mb-3 text-[0.8125rem] font-[750] uppercase tracking-[0.08em] text-brand-coral-strong">Available now</p><h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-[560] leading-none" id="available-apps-title">Apps</h2></div>
            <p className="text-[0.8125rem] font-bold text-text-subtle">{availableProducts.length} tool ready to open</p>
          </div>
          <div className="grid gap-5">{availableProducts.map((product) => (
            <Card render={<article />} key={product.slug} className="grid gap-0 overflow-hidden rounded-2xl py-0 shadow-(--shadow-md) min-[58.001rem]:grid-cols-[minmax(16rem,0.75fr)_minmax(20rem,1.25fr)]">
              <div className="flex min-h-80 flex-col items-start bg-accent-gold p-8 min-[58.001rem]:min-h-96"><span className="flex items-center gap-2 text-[0.8125rem] font-[750] text-brand-coral-strong"><FramelineMark size={28} /> Frameline</span><MonitorSmartphone className="m-auto size-10" aria-hidden="true" /><p className="font-display text-[clamp(2rem,4vw,3.25rem)] font-[560] leading-[0.95] tracking-[-0.04em]">Keep your words<br />near the lens.</p></div>
              <CardContent className="self-center p-[clamp(var(--space-7),6vw,var(--space-10))]">
                <Badge variant="secondary">Available</Badge><h2 className="mt-4 mb-3 font-display text-[clamp(2.5rem,5vw,4.5rem)] font-[560] leading-[0.95] tracking-[-0.05em]">{product.name}</h2><p className="max-w-136 text-[1.0625rem] leading-[1.6] text-text-secondary">{product.summary}</p>
                <ul className="my-6 flex list-none flex-wrap gap-3 text-[0.8125rem] font-semibold text-text-secondary" aria-label={`${product.name} highlights`}>{[product.platform,"No account","On-device processing"].map((fact) => <li className="inline-flex items-center gap-2" key={fact}><Check className="size-4 text-positive" aria-hidden="true" /> {fact}</li>)}</ul>
                <div className="flex flex-wrap items-center gap-5"><Link className={buttonVariants()} href={product.appHref}>Open {product.name} <ArrowRight data-icon="inline-end" aria-hidden="true" /></Link><Link className={buttonVariants({ variant: "link" })} href={product.productHref}>Learn more</Link></div>
              </CardContent>
            </Card>
          ))}</div>
        </section>
      </StudioContainer>
    </StudioShell>
    <StructuredData value={{ "@context": "https://schema.org", "@type": "ItemList", name: "Frameline Studio apps", itemListElement: availableProducts.map((product, index) => ({ "@type": "ListItem", position: index + 1, name: product.name, url: `${origin}${product.appHref}` })) }} />
  </>;
}
