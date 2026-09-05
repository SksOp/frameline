import type { Metadata } from "next";
import { ProductCatalog } from "@/features/studio/components/product-catalog";
import { StudioContainer, StudioPageHero, StudioSectionHeading, StudioShell } from "@/features/studio/components/studio-layout";
import { StudioPrinciples } from "@/features/studio/components/studio-principles";
import { StructuredData } from "@/features/studio/components/structured-data";
import { availableProducts, comingSoonProducts } from "@/features/studio/product-catalog";
import { getSiteOrigin } from "@/lib/site-origin";

const title = "Creator tools";
const description = "Browse Frameline's focused creator tools. Open Teleprompter now and preview the honest product directions taking shape next.";
export const metadata: Metadata = { title, description, alternates: { canonical: "/products" }, openGraph: { title: `${title} · Frameline`, description, type: "website", url: "/products", siteName: "Frameline", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Frameline creator studio" }] }, twitter: { card: "summary_large_image", title: `${title} · Frameline`, description, images: ["/opengraph-image"] } };

export default function ProductsPage() {
  const origin = getSiteOrigin();
  return <>
    <StudioShell>
      <StudioPageHero eyebrow="The toolkit · 01 available" title="Small tools. Clear jobs." titleId="products-title" lede="Use Teleprompter today, then see the focused creative workflows taking shape next. Every status here means exactly what it says." />
      <StudioContainer className="py-24"><section aria-labelledby="available-products"><StudioSectionHeading eyebrow="Ready now" title="A complete tool you can open." titleId="available-products" description="No account, no upload, and a direct path into the working Teleprompter." /><ProductCatalog products={availableProducts} /></section></StudioContainer>
      <section className="bg-text-primary py-20 text-text-inverted" aria-labelledby="coming-products"><StudioContainer><StudioSectionHeading eyebrow="In the studio" title="Useful directions, shown honestly." titleId="coming-products" description="No pretend buttons, invented launch dates, or product pages for software that does not exist yet." tone="inverted" /><ProductCatalog products={comingSoonProducts} /></StudioContainer></section>
      <StudioPrinciples />
    </StudioShell>
    <StructuredData value={{ "@context": "https://schema.org", "@type": "ItemList", name: "Frameline creator tools", itemListElement: availableProducts.map((product, index) => ({ "@type": "ListItem", position: index + 1, name: product.name, url: `${origin}${product.productHref}` })) }} />
  </>;
}
