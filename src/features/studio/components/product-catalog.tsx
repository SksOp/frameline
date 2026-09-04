import { ArrowRight, Check, Code2, Film, Smartphone, WandSparkles } from "lucide-react";
import Link from "next/link";
import type { ProductArtKind, StudioProduct } from "../product-catalog";

const productIcons = {
  prompt: Smartphone,
  code: Code2,
  clip: Film,
  "icon-motion": WandSparkles,
} satisfies Record<ProductArtKind, typeof Smartphone>;

function ProductArtwork({ product }: { product: StudioProduct }) {
  const Icon = productIcons[product.artKind];

  return (
    <div className="studio-product-art" data-art={product.artKind} aria-hidden="true">
      <span className="studio-product-art__shape studio-product-art__shape--one" />
      <span className="studio-product-art__shape studio-product-art__shape--two" />
      <div className="studio-product-art__object">
        <Icon />
        {product.artKind === "prompt" ? <p>Keep your words<br />near the lens.</p> : null}
        {product.artKind === "code" ? <p><span>const</span> idea = motion;</p> : null}
        {product.artKind === "clip" ? <p><span>00:08</span><span>00:14</span></p> : null}
        {product.artKind === "icon-motion" ? <p>tap → move → loop</p> : null}
      </div>
    </div>
  );
}

export function ProductCard({ product, compact = false }: { product: StudioProduct; compact?: boolean }) {
  const available = product.availability === "available";

  return (
    <article
      className={`studio-product-card${compact ? " studio-product-card--compact" : ""}`}
      data-availability={product.availability}
    >
      <ProductArtwork product={product} />
      <div className="studio-product-card__copy">
        <div className="studio-product-card__meta">
          <p>{product.category}</p>
          <span className={`studio-status${available ? " studio-status--available" : ""}`}>
            {available ? "Available" : "Coming soon"}
          </span>
        </div>
        <h3>{available ? <Link href={product.productHref}>{product.name}</Link> : product.name}</h3>
        <p className="studio-product-card__summary">{product.summary}</p>
        {available ? (
          <>
            <ul className="studio-facts">
              <li><Check aria-hidden="true" /><span><strong>Made for</strong>{product.platform}</span></li>
              <li><Check aria-hidden="true" /><span><strong>Local first</strong>{product.privacy}</span></li>
            </ul>
            <div className="studio-product-card__actions">
              <Link className="studio-button studio-button--secondary" href={product.productHref}>
                Explore Teleprompter <ArrowRight aria-hidden="true" />
              </Link>
              <Link className="studio-text-link" href={product.appHref}>Open the tool</Link>
            </div>
          </>
        ) : (
          <p className="studio-product-card__direction">{product.direction}</p>
        )}
      </div>
    </article>
  );
}

export function ProductCatalog({ products }: { products: readonly StudioProduct[] }) {
  return <div className="studio-product-grid">{products.map((product) => <ProductCard product={product} key={product.slug} />)}</div>;
}
