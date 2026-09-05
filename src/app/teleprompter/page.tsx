import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, LockKeyhole } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Item, ItemContent, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { PrompterDemo } from "@/features/studio/components/prompter-demo";
import { StudioContainer, StudioPageHero, StudioSectionHeading, StudioShell } from "@/features/studio/components/studio-layout";
import { StructuredData } from "@/features/studio/components/structured-data";
import { teleprompter } from "@/features/studio/product-catalog";
import { getSiteOrigin } from "@/lib/site-origin";

const title = "Teleprompter — Private teleprompter for Android";
const description = "Write, practice, and prepare a floating teleprompter on your Android phone. No account, no uploads, and on-device video generation.";
export const metadata: Metadata = { title, description, alternates: { canonical: "/teleprompter" }, openGraph: { title, description, type: "website", url: "/teleprompter", siteName: "Frameline", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Frameline creator studio" }] }, twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image"] } };

export default function TeleprompterProductPage() {
  const origin = getSiteOrigin();
  return <>
    <StudioShell>
      <StudioPageHero variant="product" eyebrow={`${teleprompter.category} · Available now`} title="Speak naturally. Keep the words nearby." titleId="teleprompter-title" lede={<>{teleprompter.description} Your script never needs to leave your phone.</>}>
        <div className="flex flex-col items-stretch gap-5 min-[42.001rem]:flex-row min-[42.001rem]:items-center"><Link className={buttonVariants()} href={teleprompter.appHref}>Open Teleprompter <ArrowRight data-icon="inline-end" aria-hidden="true" /></Link><Link className={buttonVariants({ variant: "link" })} href="#how-it-works">See how it works</Link></div>
        <ItemGroup render={<ul />} className="mt-7 list-none flex-row flex-wrap gap-3" aria-label="Product highlights">{["No account","No uploads","Free to use"].map((fact) => <Item render={<li />} className="w-auto border-0 p-0" key={fact}><ItemMedia><Check className="size-4 text-positive" aria-hidden="true" /></ItemMedia><ItemContent><ItemTitle>{fact}</ItemTitle></ItemContent></Item>)}</ItemGroup>
      </StudioPageHero>
      <StudioContainer className="-mt-8 mb-12 flex justify-start min-[58.001rem]:justify-end"><Card render={<aside />} className="min-h-56 max-w-88 rotate-3 justify-end rounded-xl border-0 bg-accent-sage p-0 shadow-(--shadow-md) transition-transform hover:rotate-1 motion-reduce:rotate-0"><CardContent className="flex flex-1 flex-col p-8"><LockKeyhole className="mb-auto size-8" aria-hidden="true" /><strong className="font-display text-3xl font-[560] leading-none">Your script stays here.</strong><span className="mt-3 text-text-secondary">Saved and prepared on this device.</span></CardContent></Card></StudioContainer>
      <section className="bg-surface-strong py-20" id="how-it-works" aria-labelledby="workflow-title"><StudioContainer><StudioSectionHeading eyebrow="Write → Practice → Record" title="From rough thought to camera-ready." titleId="workflow-title" description="See each step in the representative walkthrough. The real workspace stays simple and task-led." /><PrompterDemo /></StudioContainer></section>
      <StudioContainer className="grid gap-16 py-24 min-[42.001rem]:grid-cols-2" ><section aria-labelledby="privacy-title"><p className="mb-3 text-[0.8125rem] font-[750] uppercase tracking-[0.08em] text-brand-coral-strong">Local first</p><h2 className="max-w-[18ch] font-display text-[clamp(2.75rem,6vw,5.5rem)] font-[560] leading-[0.92] tracking-[-0.05em]" id="privacy-title">Your words are not our business.</h2><p className="mt-5 max-w-148 text-[1.0625rem] leading-[1.65] text-text-secondary">There is no account, server upload, analytics, or backend fallback. Draft persistence, preview rendering, and generated video stay inside your browser.</p></section><ItemGroup render={<ul />} className="list-none gap-0">{[["Draft","Saved locally and removable with Clear."],["Prompt video","Generated on-device and held in memory."],["Camera","Never recorded by Frameline."]].map(([fact,copy]) => <Item render={<li />} className="rounded-none border-0 border-b border-divider px-0 py-5" key={fact}><ItemMedia><Check className="size-5 text-positive" aria-hidden="true" /></ItemMedia><ItemContent><ItemTitle>{fact}</ItemTitle><p className="text-sm text-text-secondary">{copy}</p></ItemContent></Item>)}</ItemGroup></StudioContainer>
      <section className="bg-text-primary py-20 text-text-inverted" aria-labelledby="requirements-title"><StudioContainer><StudioSectionHeading eyebrow="Before you begin" title="An honest support boundary." titleId="requirements-title" description="Teleprompter is designed for a current version of Chrome on Android. Support still varies by browser and phone." tone="inverted" />
        <Accordion className="grid gap-4 min-[42.001rem]:grid-cols-2" defaultValue={["requirements"]}>
          <AccordionItem className="rounded-lg border border-text-secondary px-4 data-open:bg-surface data-open:text-text-primary" value="requirements"><AccordionTrigger className="font-display text-2xl font-[560] text-text-inverted hover:bg-text-secondary active:bg-text-secondary aria-expanded:bg-surface aria-expanded:text-text-primary [&_svg]:text-current!">Requirements</AccordionTrigger><AccordionContent className="px-2 pb-5"><ul className="list-disc space-y-3 pl-6 leading-[1.65] text-text-secondary">{teleprompter.requirements.map((item) => <li key={item}>{item}</li>)}</ul></AccordionContent></AccordionItem>
          <AccordionItem className="rounded-lg border border-text-secondary px-4 data-open:bg-surface data-open:text-text-primary" value="good-to-know"><AccordionTrigger className="font-display text-2xl font-[560] text-text-inverted hover:bg-text-secondary active:bg-text-secondary aria-expanded:bg-surface aria-expanded:text-text-primary [&_svg]:text-current!">Good to know</AccordionTrigger><AccordionContent className="px-2 pb-5"><ul className="list-disc space-y-3 pl-6 leading-[1.65] text-text-secondary">{teleprompter.limitations.map((item) => <li key={item}>{item}</li>)}</ul></AccordionContent></AccordionItem>
        </Accordion>
        <div className="mt-7 flex flex-col items-stretch justify-between gap-6 rounded-xl bg-accent-gold p-6 text-text-primary min-[42.001rem]:flex-row min-[42.001rem]:items-center"><p className="max-w-200 leading-[1.55]"><strong>Important:</strong> Picture-in-Picture is an opaque Android system video window—not a transparent, click-through overlay. Android controls its final size, placement, and controls.</p><Link className={buttonVariants()} href={teleprompter.appHref}>Open Teleprompter <ArrowRight data-icon="inline-end" aria-hidden="true" /></Link></div>
      </StudioContainer></section>
    </StudioShell>
    <StructuredData value={{ "@context": "https://schema.org", "@type": "SoftwareApplication", name: teleprompter.name, applicationCategory: "MultimediaApplication", operatingSystem: "Android", browserRequirements: "Requires a current version of Chrome with WebCodecs and Picture-in-Picture support.", description, url: `${origin}${teleprompter.productHref}`, isAccessibleForFree: true, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }} />
  </>;
}
