import { ArrowRight, Check, Code2, Smartphone, Workflow } from "lucide-react";
import Link from "next/link";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import type { ProductArtKind, StudioProduct } from "../product-catalog";

const productIcons = { prompt: Smartphone, code: Code2, workflow: Workflow } satisfies Record<ProductArtKind, typeof Smartphone>;
const artClasses = {
  prompt: "bg-accent-gold",
  code: "bg-brand-coral-soft [&_[data-art-shape=two]]:bg-accent-gold",
  workflow: "bg-accent-gold-soft [&_[data-art-shape=two]]:bg-accent-sage",
} satisfies Record<ProductArtKind, string>;

function ProductArtwork({ product, featured }: { product: StudioProduct; featured: boolean }) {
  const Icon = productIcons[product.artKind];
  return (
    <div className={cn("relative isolate grid min-h-68 place-items-center overflow-hidden bg-surface-strong", featured && "min-h-80 min-[58.001rem]:min-h-120", artClasses[product.artKind])} aria-hidden="true">
      <span className="absolute -top-20 -left-16 -z-1 aspect-square w-56 rounded-full bg-surface-elevated/55" />
      <span data-art-shape="two" className="absolute -right-16 -bottom-20 -z-1 aspect-square w-48 rounded-full bg-brand-coral/60" />
      <div className="flex min-h-44 w-[min(15rem,72%)] -rotate-3 flex-col items-center justify-between rounded-xl border border-border bg-surface-elevated p-5 shadow-(--shadow-lg) transition-transform duration-(--duration-slow) ease-(--ease-buoyant) group-hover/card:rotate-1 group-hover/card:scale-[1.02] group-focus-within/card:rotate-1 group-focus-within/card:scale-[1.02] motion-reduce:transform-none">
        <Icon className="size-8 text-brand-coral-strong" />
        {product.artKind === "prompt" ? <p className="mt-5 w-full text-center text-sm font-[750]">Keep your words<br />near the lens.</p> : null}
        {product.artKind === "code" ? <p className="mt-5 w-full text-center text-sm font-[750]"><span className="mx-1 font-mono text-brand-coral-strong">const</span> idea = motion;</p> : null}
        {product.artKind === "workflow" ? <p className="mt-5 w-full text-center text-sm font-[750]">capture → arrange → animate</p> : null}
      </div>
    </div>
  );
}

export function ProductCard({ product, compact = false }: { product: StudioProduct; compact?: boolean }) {
  const available = product.availability === "available";
  const featured = available && !compact;
  return (
    <Card render={<article />} data-availability={product.availability} className={cn("min-w-0 gap-0 rounded-2xl py-0 transition-[transform,box-shadow] duration-(--duration-standard) ease-(--ease-buoyant) hover:-translate-y-2 hover:shadow-(--shadow-md) focus-within:-translate-y-2 focus-within:shadow-(--shadow-md) motion-reduce:transform-none", featured && "min-[58.001rem]:col-span-full min-[58.001rem]:grid min-[58.001rem]:grid-cols-[minmax(18rem,0.85fr)_minmax(20rem,1.15fr)]")}>
      <ProductArtwork product={product} featured={featured} />
      <CardContent className={cn("self-stretch p-6 min-[42.001rem]:p-8", featured && "min-[58.001rem]:self-center min-[58.001rem]:p-[clamp(var(--space-7),6vw,var(--space-10))]")}>
        <div className="flex items-center justify-between gap-3 max-[25rem]:items-start max-[25rem]:flex-col">
          <p className="text-xs font-[750] uppercase tracking-[0.05em] text-text-subtle">{product.category}</p>
          <Badge variant={available ? "secondary" : "outline"}>{available ? "Available" : "Coming soon"}</Badge>
        </div>
        <h3 className="mt-5 mb-3 font-display text-[clamp(2rem,4vw,3.75rem)] font-[560] leading-[0.95] tracking-[-0.045em]">{available ? <Link className="decoration-transparent decoration-[0.06em] underline-offset-8 hover:decoration-brand-coral" href={product.productHref}>{product.name}</Link> : product.name}</h3>
        <p className="text-[1.0625rem] leading-[1.55] text-text-secondary">{product.summary}</p>
        {available ? (
          <>
            {!compact ? <ItemGroup render={<ul />} className="my-7 list-none gap-3">
              <Item render={<li />} className="rounded-none border-0 border-t border-divider px-0 pt-3"><ItemMedia><Check className="mt-1 size-[1.1rem] text-positive" aria-hidden="true" /></ItemMedia><ItemContent><ItemTitle>Made for</ItemTitle><ItemDescription className="line-clamp-none">{product.platform}</ItemDescription></ItemContent></Item>
              <Item render={<li />} className="rounded-none border-0 border-t border-divider px-0 pt-3"><ItemMedia><Check className="mt-1 size-[1.1rem] text-positive" aria-hidden="true" /></ItemMedia><ItemContent><ItemTitle>Local first</ItemTitle><ItemDescription className="line-clamp-none">{product.privacy}</ItemDescription></ItemContent></Item>
            </ItemGroup> : null}
            <div className={cn("flex flex-wrap items-center gap-4", compact && "mt-6")}>
              <Link className={buttonVariants({ variant: "secondary" })} href={product.productHref}>Explore Teleprompter <ArrowRight data-icon="inline-end" aria-hidden="true" /></Link>
              <Link className={buttonVariants({ variant: "link" })} href={product.appHref}>Open the tool</Link>
            </div>
          </>
        ) : <p className="mt-6 border-t border-divider pt-4 text-sm leading-[1.5] text-text-subtle">{product.direction}</p>}
      </CardContent>
    </Card>
  );
}

export function ProductCatalog({ products }: { products: readonly StudioProduct[] }) {
  return <div className="grid grid-cols-1 gap-5 min-[58.001rem]:grid-cols-2 min-[68.001rem]:grid-cols-3">{products.map((product) => <ProductCard product={product} key={product.slug} />)}</div>;
}
