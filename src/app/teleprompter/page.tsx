import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Info, LockKeyhole } from "lucide-react";
import { PrompterDemo } from "@/features/studio/components/prompter-demo";
import { StructuredData } from "@/features/studio/components/structured-data";
import { StudioFooter } from "@/features/studio/components/studio-footer";
import { StudioNavigation } from "@/features/studio/components/studio-navigation";
import { teleprompter } from "@/features/studio/product-catalog";
import { getSiteOrigin } from "@/lib/site-origin";
import "@/features/studio/studio.css";

const title = "Teleprompter — Private teleprompter for Android";
const description =
  "Write, practice, and prepare a floating teleprompter on your Android phone. No account, no uploads, and on-device video generation.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/teleprompter" },
  openGraph: {
    title,
    description,
    type: "website",
    url: "/teleprompter",
    siteName: "Frameline",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Frameline creator studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/opengraph-image"],
  },
};

export default function TeleprompterProductPage() {
  const origin = getSiteOrigin();

  return (
    <div className="studio-site">
      <StudioNavigation />
      <main>
        <section className="studio-main studio-page-hero studio-page-hero--product">
          <div>
            <p className="studio-eyebrow">{teleprompter.category} · Available now</p>
            <h1 className="studio-title">Speak naturally. Keep the words nearby.</h1>
            <p className="studio-lede">{teleprompter.description} Your script never needs to leave your phone.</p>
            <div className="studio-actions">
              <Link className="studio-button" href={teleprompter.appHref}>Open Teleprompter <ArrowRight aria-hidden="true" /></Link>
              <Link className="studio-text-link" href="#how-it-works">See how it works</Link>
            </div>
            <ul className="studio-inline-facts" aria-label="Product highlights">
              <li><Check aria-hidden="true" /> No account</li><li><Check aria-hidden="true" /> No uploads</li><li><Check aria-hidden="true" /> Free to use</li>
            </ul>
          </div>
          <aside className="studio-product-stamp"><LockKeyhole aria-hidden="true" /><strong>Your script stays here.</strong><span>Saved and prepared on this device.</span></aside>
        </section>
        <section className="studio-demo-section" id="how-it-works" aria-labelledby="workflow-title">
          <div className="studio-main">
            <div className="studio-section-heading"><div><p className="studio-eyebrow">Write → Practice → Record</p><h2 id="workflow-title">From rough thought to camera-ready.</h2></div><p>Open each step in the representative walkthrough. The real workspace stays simple and task-led.</p></div>
            <PrompterDemo />
          </div>
        </section>
        <section className="studio-main studio-privacy" aria-labelledby="privacy-title">
          <div><p className="studio-eyebrow">Local first</p><h2 id="privacy-title">Your words are not our business.</h2><p>There is no account, server upload, analytics, or backend fallback. Draft persistence, preview rendering, and generated video stay inside your browser.</p></div>
          <ul><li><Check aria-hidden="true" /><span><strong>Draft</strong>Saved locally and removable with Clear.</span></li><li><Check aria-hidden="true" /><span><strong>Prompt video</strong>Generated on-device and held in memory.</span></li><li><Check aria-hidden="true" /><span><strong>Camera</strong>Never recorded by Frameline.</span></li></ul>
        </section>
        <section className="studio-requirements" aria-labelledby="requirements-title"><div className="studio-main">
          <div className="studio-section-heading studio-section-heading--light"><div><p className="studio-eyebrow">Before you begin</p><h2 id="requirements-title">An honest support boundary.</h2></div><p>Teleprompter is designed for a current version of Chrome on Android. Support still varies by browser and phone.</p></div>
          <div className="studio-disclosures">
            <details open><summary><span>Requirements</span><Info aria-hidden="true" /></summary><ul>{teleprompter.requirements.map((item) => <li key={item}>{item}</li>)}</ul></details>
            <details><summary><span>Good to know</span><Info aria-hidden="true" /></summary><ul>{teleprompter.limitations.map((item) => <li key={item}>{item}</li>)}</ul></details>
          </div>
          <div className="studio-requirements__cta"><p><strong>Important:</strong> Picture-in-Picture is an opaque Android system video window—not a transparent, click-through overlay. Android controls its final size, placement, and controls.</p><Link className="studio-button" href={teleprompter.appHref}>Open Teleprompter <ArrowRight aria-hidden="true" /></Link></div>
        </div></section>
      </main>
      <StudioFooter />
      <StructuredData
        value={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: teleprompter.name,
          applicationCategory: "MultimediaApplication",
          operatingSystem: "Android",
          browserRequirements: "Requires a current version of Chrome with WebCodecs and Picture-in-Picture support.",
          description,
          url: `${origin}${teleprompter.productHref}`,
          isAccessibleForFree: true,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />
    </div>
  );
}
