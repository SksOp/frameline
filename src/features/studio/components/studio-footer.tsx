import Link from "next/link";
import { studioNavigationProducts } from "@/features/studio/product-catalog";
import { FramelineLogo } from "./frameline-logo";
import { StudioContainer } from "./studio-container";

const footerLinkClass = "inline-flex min-h-11 items-center font-semibold underline-offset-2 transition-colors duration-(--duration-fast) hover:text-brand-coral-strong";

export function StudioFooter() {
  return <footer className="border-t border-divider bg-surface-strong pt-12 text-text-secondary min-[42.001rem]:pt-16">
    <StudioContainer className="grid gap-10 pb-16 min-[58.001rem]:grid-cols-[minmax(15rem,0.7fr)_minmax(0,1.3fr)] min-[58.001rem]:gap-16">
      <div><Link className="inline-flex min-h-11 items-center text-text-primary no-underline" href="/" aria-label="Frameline home"><FramelineLogo /></Link><p className="my-4 max-w-100 text-[1.0625rem] leading-[1.55]">Private, immediate creator tools that run close to your work.</p></div>
      <nav className="grid grid-cols-1 gap-8 min-[25.001rem]:grid-cols-2 min-[42.001rem]:grid-cols-[minmax(15rem,1.35fr)_minmax(9rem,0.7fr)]" aria-label="Footer navigation">
        <section aria-labelledby="footer-products-title"><h2 className="mb-4 text-[0.8125rem] font-bold uppercase tracking-[0.06em] text-text-primary" id="footer-products-title">Products</h2><ul className="list-none">{studioNavigationProducts.map((product) => <li className="grid min-h-11 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-divider" key={product.name}>{product.availability === "available" ? <Link className={footerLinkClass} href={product.productHref}>{product.name}</Link> : <span>{product.name}</span>}<small className="block text-[0.6875rem] font-semibold text-text-subtle">{product.availability === "available" ? "Available" : "Coming soon"}</small></li>)}</ul></section>
        <section aria-labelledby="footer-explore-title"><h2 className="mb-4 text-[0.8125rem] font-bold uppercase tracking-[0.06em] text-text-primary" id="footer-explore-title">Explore</h2><ul className="list-none">{[["Home","/"],["Studio","/studio"],["Products","/products"],["Solutions","/solutions"],["Teleprompter","/teleprompter"]].map(([label,href]) => <li key={href}><Link className={footerLinkClass} href={href}>{label}</Link></li>)}</ul></section>
      </nav>
    </StudioContainer>
    <StudioContainer className="flex min-h-19 flex-col items-start justify-between gap-5 border-t border-divider py-5 text-[0.8125rem] min-[42.001rem]:flex-row min-[42.001rem]:items-center"><p>© 2026 Frameline</p><p>Teleprompter inputs and generated video stay on your device.</p></StudioContainer>
  </footer>;
}
