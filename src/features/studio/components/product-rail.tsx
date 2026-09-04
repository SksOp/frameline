import type { StudioProduct } from "../product-catalog";
import { ProductCard } from "./product-catalog";

export function ProductRail({ products, label }: { products: readonly StudioProduct[]; label: string }) {
  return (
    <div className="studio-product-rail" role="region" aria-label={label} tabIndex={0}>
      {products.map((product) => <ProductCard compact product={product} key={product.slug} />)}
    </div>
  );
}
