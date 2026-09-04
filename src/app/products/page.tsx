import type { Metadata } from "next";
import { ProductCatalog } from "@/features/studio/components/product-catalog";
import { StudioPrinciples } from "@/features/studio/components/studio-principles";
import { StructuredData } from "@/features/studio/components/structured-data";
import { StudioFooter } from "@/features/studio/components/studio-footer";
import { StudioNavigation } from "@/features/studio/components/studio-navigation";
import { availableProducts, comingSoonProducts } from "@/features/studio/product-catalog";
import { getSiteOrigin } from "@/lib/site-origin";
import "@/features/studio/studio.css";

const title = "Creator tools";
const description =
  "Browse Frameline's focused creator tools. Open Teleprompter now and preview the honest product directions taking shape next.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/products" },
  openGraph: {
    title: `${title} · Frameline`,
    description,
    type: "website",
    url: "/products",
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

export default function ProductsPage() {
  const origin = getSiteOrigin();

  return (
    <div className="studio-site">
      <StudioNavigation />
      <main>
        <section className="studio-main studio-page-hero">
          <p className="studio-eyebrow">The toolkit · 01 available</p>
          <h1 className="studio-title">Small tools. Clear jobs.</h1>
          <p className="studio-lede">
            Use Teleprompter today, then see the focused creative workflows taking shape next.
            Every status here means exactly what it says.
          </p>
        </section>
        <section className="studio-main studio-product-index studio-product-index--available" aria-labelledby="available-products">
          <div className="studio-section-heading">
            <div><p className="studio-eyebrow">Ready now</p><h2 id="available-products">A complete tool you can open.</h2></div>
            <p>No account, no upload, and a direct path into the working Teleprompter.</p>
          </div>
          <ProductCatalog products={availableProducts} />
        </section>
        <section className="studio-product-directions" aria-labelledby="coming-products">
          <div className="studio-main">
            <div className="studio-section-heading studio-section-heading--light">
              <div><p className="studio-eyebrow">In the studio</p><h2 id="coming-products">Useful directions, shown honestly.</h2></div>
              <p>No pretend buttons, invented launch dates, or product pages for software that does not exist yet.</p>
            </div>
            <ProductCatalog products={comingSoonProducts} />
          </div>
        </section>
        <StudioPrinciples />
      </main>
      <StudioFooter />
      <StructuredData
        value={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Frameline creator tools",
          itemListElement: availableProducts.map((product, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: product.name,
            url: `${origin}${product.productHref}`,
          })),
        }}
      />
    </div>
  );
}
