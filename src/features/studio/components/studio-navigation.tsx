"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ArrowUpRight, Code2, Focus, Menu, MonitorSmartphone, Sparkles, Workflow, X } from "lucide-react";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Item } from "@/components/ui/item";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { availableProducts, studioNavigationProducts, type AvailableStudioProduct, type ProductArtKind } from "@/features/studio/product-catalog";
import { studioSolutions } from "@/features/studio/studio-solutions";
import { FramelineLogo } from "./frameline-logo";
import { solutionIcons } from "./solution-icons";

const productIcons = { prompt: MonitorSmartphone, code: Code2, workflow: Workflow } satisfies Record<ProductArtKind, typeof MonitorSmartphone>;

const menuEntryClass = "grid min-h-32 w-full grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 rounded-md p-4 text-left text-text-primary outline-none transition-colors hover:bg-surface-inset focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-offset-2 data-[selected=true]:border data-[selected=true]:border-border data-[selected=true]:bg-brand-coral-soft data-[selected=true]:shadow-(--shadow-sm)";
const menuTextClass = "[&_small]:mt-1 [&_small]:block [&_small]:text-[0.8125rem] [&_small]:font-medium [&_small]:leading-[1.45] [&_small]:text-text-secondary [&_strong]:block";
const teaserClass = "flex min-w-0 flex-col items-stretch justify-end gap-3 rounded-lg border border-divider bg-accent-gold-soft p-5 text-text-primary transition-colors hover:bg-accent-gold";

function ProductMenuContent() {
  const [selectedSlug, setSelectedSlug] = useState(availableProducts[0].slug);
  const selectedProduct = availableProducts.find((product) => product.slug === selectedSlug) ?? availableProducts[0];
  return <div className="grid min-h-100 grid-cols-[minmax(0,1fr)_minmax(17rem,0.3fr)] gap-5 p-5">
    <div className="min-w-0">
      <div className="mb-4 flex min-h-11 items-center justify-between gap-5 px-3"><p className="text-[0.8125rem] font-bold uppercase tracking-[0.06em] text-text-subtle">Creator tools</p><NavigationMenuLink render={<Link href="/products" />} closeOnClick className="inline-flex min-h-11 items-center gap-2 p-2 text-[0.8125rem] font-bold text-brand-coral-strong underline-offset-1">View all products <ArrowRight className="size-4" aria-hidden="true" /></NavigationMenuLink></div>
      <div className="grid grid-cols-2 gap-2">{studioNavigationProducts.map((product) => {
        const Icon = productIcons[product.artKind];
        const previewProps = { onFocus: () => setSelectedSlug(product.slug), onPointerEnter: () => setSelectedSlug(product.slug) };
        const content = <><Icon className="mt-1 size-5 text-brand-coral-strong" aria-hidden="true" /><span className={menuTextClass}><strong>{product.name}</strong><small>{product.description}</small></span><Badge variant={product.availability === "available" ? "secondary" : "outline"}>{product.availability === "available" ? "Available" : "Coming soon"}</Badge></>;
        return product.availability === "available" ? <NavigationMenuLink key={product.name} render={<Link href={product.productHref} />} closeOnClick className={menuEntryClass} data-selected={selectedSlug === product.slug ? "true" : undefined} {...previewProps}>{content}</NavigationMenuLink> : <Item render={<article aria-label={`${product.name}, coming soon`} />} className={cn(menuEntryClass, "border border-transparent bg-surface hover:bg-surface")} key={product.name}>{content}</Item>;
      })}</div>
    </div>
    <ProductMenuPreview product={selectedProduct} />
  </div>;
}

function ProductMenuPreview({ product }: { product: AvailableStudioProduct }) {
  const artClass = product.artKind === "code" ? "bg-brand-coral-strong" : product.artKind === "workflow" ? "bg-accent-sage-strong" : "bg-brand-coral";
  return <NavigationMenuLink render={<Link href={product.productHref} />} closeOnClick className={teaserClass}>
    <span className={cn("mb-auto grid min-h-32 place-items-center overflow-hidden rounded-lg text-text-inverted", artClass)} aria-hidden="true"><Sparkles className="size-12" /></span>
    <Badge variant="secondary">Available now</Badge>
    <strong className="block font-display text-3xl font-[560] leading-none">{product.name}</strong>
    <small className="block text-sm text-text-secondary">{product.summary}</small>
    <span className="mt-2 inline-flex items-center gap-2 text-[0.8125rem] font-bold text-brand-coral-strong">Explore the product <ArrowUpRight className="size-4" aria-hidden="true" /></span>
  </NavigationMenuLink>;
}

function SolutionsMenuContent() {
  return <div className="grid min-h-100 grid-cols-[minmax(0,1fr)_minmax(17rem,0.3fr)] gap-5 p-5"><div className="min-w-0"><div className="mb-4 flex min-h-11 items-center justify-between gap-5 px-3"><p className="text-[0.8125rem] font-bold uppercase tracking-[0.06em] text-text-subtle">How Frameline works</p><NavigationMenuLink render={<Link href="/solutions" />} closeOnClick className="inline-flex min-h-11 items-center gap-2 p-2 text-[0.8125rem] font-bold text-brand-coral-strong">Explore our approach <ArrowRight className="size-4" aria-hidden="true" /></NavigationMenuLink></div><div className="grid grid-cols-3 gap-2">{studioSolutions.map(({ slug, name, description, iconKind }) => {
      const Icon = solutionIcons[iconKind];
      return <div className={cn("flex min-h-36 items-start gap-3 border-b border-divider p-4", menuTextClass)} key={slug}><Icon className="mt-1 size-5 text-brand-coral-strong" aria-hidden="true" /><span><strong>{name}</strong><small>{description}</small></span></div>;
    })}</div></div><NavigationMenuLink render={<Link href="/solutions" />} closeOnClick className={cn(teaserClass, "bg-accent-sage-soft hover:bg-accent-sage")}><span className="mb-auto grid min-h-32 place-items-center rounded-lg bg-accent-sage-strong text-text-inverted" aria-hidden="true"><Focus className="size-12" /></span><Badge variant="outline">The idea</Badge><strong className="block font-display text-3xl font-[560] leading-none">Small tools. A short path to making.</strong><small className="block text-sm text-text-secondary">Frameline removes accounts, uploads, and ceremony wherever they are not needed.</small><span className="mt-2 inline-flex items-center gap-2 text-[0.8125rem] font-bold text-brand-coral-strong">See the principles <ArrowUpRight className="size-4" aria-hidden="true" /></span></NavigationMenuLink></div>;
}

function MobileNavigation() {
  const [open, setOpen] = useState(false);
  return <Drawer open={open} onOpenChange={setOpen} swipeDirection="right">
    <DrawerTrigger render={<Button variant="outline" size="icon" className="ml-auto min-[48rem]:hidden" />}><Menu aria-hidden="true" /><span className="sr-only">Open navigation</span></DrawerTrigger>
    <DrawerContent className="h-dvh max-h-dvh w-[min(92vw,29rem)] max-[25rem]:w-screen">
      <DrawerHeader className="flex-row items-start justify-between gap-4 border-b border-divider px-5 pt-[max(var(--space-5),env(safe-area-inset-top))] pb-4 text-left"><div><DrawerTitle>Explore Frameline</DrawerTitle><DrawerDescription>Private, immediate creator tools.</DrawerDescription></div><DrawerClose render={<Button variant="ghost" size="icon" aria-label="Close navigation" />}><X aria-hidden="true" /></DrawerClose></DrawerHeader>
      <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5" aria-label="Mobile navigation">
        <section aria-labelledby="mobile-products-title"><div className="flex min-h-11 items-center justify-between gap-4 border-b border-divider"><h2 className="text-[0.8125rem] font-bold uppercase tracking-[0.06em]" id="mobile-products-title">Products</h2><Link className={buttonVariants({ variant: "link" })} href="/products" onClick={() => setOpen(false)}>View all</Link></div>{studioNavigationProducts.map((product) => <div className="grid min-h-11 grid-cols-[minmax(0,1fr)_auto] items-start gap-3 border-b border-divider py-4" key={product.name}>{product.availability === "available" ? <Link className={menuTextClass} href={product.productHref} onClick={() => setOpen(false)}><strong>{product.name}</strong><small>{product.description}</small></Link> : <span className={menuTextClass}><strong>{product.name}</strong><small>{product.description}</small></span>}<Badge variant={product.availability === "available" ? "secondary" : "outline"}>{product.availability === "available" ? "Available" : "Coming soon"}</Badge></div>)}</section>
        <section className="mt-8" aria-labelledby="mobile-solutions-title"><div className="flex min-h-11 items-center justify-between gap-4 border-b border-divider"><h2 className="text-[0.8125rem] font-bold uppercase tracking-[0.06em]" id="mobile-solutions-title">Solutions</h2><Link className={buttonVariants({ variant: "link" })} href="/solutions" onClick={() => setOpen(false)}>Explore</Link></div><div className="flex flex-wrap gap-2 pt-4">{studioSolutions.map(({ slug, name, iconKind }) => {
          const Icon = solutionIcons[iconKind];
          return <Badge variant="outline" key={slug}><Icon aria-hidden="true" /> {name}</Badge>;
        })}</div></section>
      </nav>
      <div className="border-t border-divider px-5 pt-4 pb-[max(var(--space-5),env(safe-area-inset-bottom))]"><Link className={cn(buttonVariants({ variant: "secondary" }), "w-full")} href="/studio" onClick={() => setOpen(false)}>Open Studio <ArrowUpRight data-icon="inline-end" aria-hidden="true" /></Link></div>
    </DrawerContent>
  </Drawer>;
}

export function StudioNavigation() {
  return <header className="relative z-20 border-b border-divider bg-canvas">
    <div className="mx-auto flex min-h-16 w-[min(calc(100%_-_2_*_clamp(var(--space-4),2.5vw,var(--space-8))),96rem)] items-center gap-5 min-[48rem]:min-h-19">
      <Link className="inline-flex items-center no-underline" href="/" aria-label="Frameline home"><FramelineLogo /></Link>
      <NavigationMenu className="hidden max-w-none flex-none justify-start min-[48rem]:flex" aria-label="Main navigation" delay={80} closeDelay={160}>
        <NavigationMenuList>
          <NavigationMenuItem value="products"><NavigationMenuTrigger>Products</NavigationMenuTrigger><NavigationMenuContent keepMounted className="max-h-[min(42rem,calc(100dvh-6rem))] w-[min(90vw,84rem)] overflow-y-auto overscroll-contain"><ProductMenuContent /></NavigationMenuContent></NavigationMenuItem>
          <NavigationMenuItem value="solutions"><NavigationMenuTrigger>Solutions</NavigationMenuTrigger><NavigationMenuContent keepMounted className="max-h-[min(42rem,calc(100dvh-6rem))] w-[min(90vw,84rem)] overflow-y-auto overscroll-contain"><SolutionsMenuContent /></NavigationMenuContent></NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <Link className={cn(buttonVariants({ variant: "secondary" }), "ml-auto hidden min-[48rem]:inline-flex")} href="/studio">Studio <ArrowUpRight data-icon="inline-end" aria-hidden="true" /></Link>
      <MobileNavigation />
    </div>
  </header>;
}
