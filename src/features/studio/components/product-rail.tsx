import type { StudioProduct } from "../product-catalog";
import { ProductCard } from "./product-catalog";

export function ProductRail({ products, label }: { products: readonly StudioProduct[]; label: string }) {
  return (
    <div className="grid snap-x snap-mandatory auto-cols-[min(86vw,25rem)] grid-flow-col gap-5 overflow-x-auto overscroll-x-contain px-2 pt-2 pb-6 [scrollbar-color:var(--brand-coral-strong)_var(--surface-inset)] focus-visible:rounded-lg min-[25.001rem]:auto-cols-[clamp(18rem,66vw,34rem)]" role="region" aria-label={label} tabIndex={0}>
      {products.map((product) => <div className="snap-start" key={product.slug}><ProductCard compact product={product} /></div>)}
    </div>
  );
}
