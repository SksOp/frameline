"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Code2,
  Film,
  Focus,
  Gift,
  Menu,
  MonitorSmartphone,
  ShieldCheck,
  Sparkles,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { studioNavigationProducts } from "@/features/studio/product-catalog";

const productIcons = [MonitorSmartphone, Code2, Film, WandSparkles] as const;

const studioSolutions = [
  { name: "Focused", description: "One clear creative job per tool.", icon: Focus },
  { name: "Private", description: "Your creative inputs are yours, not a business model.", icon: ShieldCheck },
  { name: "Client-side", description: "Work is processed in your browser whenever the tool can do it there.", icon: MonitorSmartphone },
  { name: "Immediate", description: "Open a tool and begin—no account or setup ritual.", icon: Zap },
  { name: "Free", description: "The available tool has a real free path, without a watermark.", icon: Gift },
] as const;

function ProductMenuContent() {
  return (
    <div className="studio-mega-menu studio-mega-menu--products">
      <div className="studio-mega-menu__main">
        <div className="studio-mega-menu__heading">
          <p>Creator tools</p>
          <NavigationMenuLink render={<Link href="/products" />} closeOnClick className="studio-mega-menu__heading-link">
            View all products <ArrowRight aria-hidden="true" />
          </NavigationMenuLink>
        </div>
        <div className="studio-mega-menu__grid">
          {studioNavigationProducts.map((product, index) => {
            const Icon = productIcons[index];

            return product.availability === "available" ? (
              <NavigationMenuLink
                key={product.name}
                render={<Link href={product.productHref} />}
                closeOnClick
                className="studio-mega-menu__entry"
              >
                <Icon aria-hidden="true" />
                <span><strong>{product.name}</strong><small>{product.description}</small></span>
                <span className="studio-status studio-status--available">Available</span>
              </NavigationMenuLink>
            ) : (
              <div className="studio-mega-menu__entry studio-mega-menu__entry--soon" key={product.name}>
                <Icon aria-hidden="true" />
                <span><strong>{product.name}</strong><small>{product.description}</small></span>
                <span className="studio-status">Coming soon</span>
              </div>
            );
          })}
        </div>
      </div>
      <NavigationMenuLink
        render={<Link href="/teleprompter" />}
        closeOnClick
        className="studio-mega-menu__teaser"
      >
        <span className="studio-mega-menu__teaser-art" aria-hidden="true"><Sparkles /></span>
        <span className="studio-status studio-status--available">Available now</span>
        <strong>Teleprompter</strong>
        <small>Write, practice, and keep your words close while the camera rolls.</small>
        <span className="studio-mega-menu__teaser-link">Explore the product <ArrowUpRight aria-hidden="true" /></span>
      </NavigationMenuLink>
    </div>
  );
}

function SolutionsMenuContent() {
  return (
    <div className="studio-mega-menu studio-mega-menu--solutions">
      <div className="studio-mega-menu__main">
        <div className="studio-mega-menu__heading">
          <p>How Frameline works</p>
          <NavigationMenuLink render={<Link href="/solutions" />} closeOnClick className="studio-mega-menu__heading-link">
            Explore our approach <ArrowRight aria-hidden="true" />
          </NavigationMenuLink>
        </div>
        <div className="studio-mega-menu__solutions-grid">
          {studioSolutions.map(({ name, description, icon: Icon }) => (
            <div className="studio-mega-menu__solution" key={name}>
              <Icon aria-hidden="true" />
              <span><strong>{name}</strong><small>{description}</small></span>
            </div>
          ))}
        </div>
      </div>
      <NavigationMenuLink
        render={<Link href="/solutions" />}
        closeOnClick
        className="studio-mega-menu__teaser studio-mega-menu__teaser--solutions"
      >
        <span className="studio-mega-menu__teaser-art" aria-hidden="true"><Focus /></span>
        <span className="studio-status">The idea</span>
        <strong>Small tools. A short path to making.</strong>
        <small>Frameline removes accounts, uploads, and ceremony wherever they are not needed.</small>
        <span className="studio-mega-menu__teaser-link">See the principles <ArrowUpRight aria-hidden="true" /></span>
      </NavigationMenuLink>
    </div>
  );
}

function MobileNavigation() {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen} swipeDirection="right">
      <DrawerTrigger render={<Button variant="outline" size="icon" className="studio-mobile-menu-trigger" />}>
        <Menu aria-hidden="true" />
        <span className="sr-only">Open navigation</span>
      </DrawerTrigger>
      <DrawerContent className="studio-mobile-menu">
        <DrawerHeader className="studio-mobile-menu__header">
          <div>
            <DrawerTitle>Explore Frameline</DrawerTitle>
            <DrawerDescription>Private, immediate creator tools.</DrawerDescription>
          </div>
          <DrawerClose render={<Button variant="ghost" size="icon" aria-label="Close navigation" />}>
            <X aria-hidden="true" />
          </DrawerClose>
        </DrawerHeader>
        <nav className="studio-mobile-menu__body" aria-label="Mobile navigation">
          <section aria-labelledby="mobile-products-title">
            <div className="studio-mobile-menu__section-heading">
              <h2 id="mobile-products-title">Products</h2>
              <Link href="/products" onClick={() => setOpen(false)}>View all</Link>
            </div>
            {studioNavigationProducts.map((product) => product.availability === "available" ? (
              <Link className="studio-mobile-menu__link" href={product.productHref} onClick={() => setOpen(false)} key={product.name}>
                <span><strong>{product.name}</strong><small>{product.description}</small></span>
                <span className="studio-status studio-status--available">Available</span>
              </Link>
            ) : (
              <div className="studio-mobile-menu__link studio-mobile-menu__link--soon" key={product.name}>
                <span><strong>{product.name}</strong><small>{product.description}</small></span>
                <span className="studio-status">Coming soon</span>
              </div>
            ))}
          </section>
          <section aria-labelledby="mobile-solutions-title">
            <div className="studio-mobile-menu__section-heading">
              <h2 id="mobile-solutions-title">Solutions</h2>
              <Link href="/solutions" onClick={() => setOpen(false)}>Explore</Link>
            </div>
            <div className="studio-mobile-menu__principles">
              {studioSolutions.map(({ name, icon: Icon }) => (
                <span key={name}><Icon aria-hidden="true" /> {name}</span>
              ))}
            </div>
          </section>
        </nav>
        <div className="studio-mobile-menu__footer">
          <Link className="studio-navigation__launch" href="/teleprompter/app" onClick={() => setOpen(false)}>
            Open Teleprompter <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export function StudioNavigation() {
  return (
    <header className="studio-header">
      <div className="studio-navigation-frame">
        <Link className="studio-wordmark" href="/" aria-label="Frameline home">
          <span aria-hidden="true">F</span> Frameline
        </Link>
        <NavigationMenu className="studio-desktop-navigation" aria-label="Main navigation" delay={80} closeDelay={160}>
          <NavigationMenuList>
            <NavigationMenuItem value="products">
              <NavigationMenuTrigger>Products</NavigationMenuTrigger>
              <NavigationMenuContent keepMounted className="studio-mega-menu-content"><ProductMenuContent /></NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem value="solutions">
              <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
              <NavigationMenuContent keepMounted className="studio-mega-menu-content"><SolutionsMenuContent /></NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <Link className="studio-navigation__launch studio-navigation__desktop-launch" href="/teleprompter/app">
          Open Teleprompter <ArrowUpRight aria-hidden="true" />
        </Link>
        <MobileNavigation />
      </div>
    </header>
  );
}
