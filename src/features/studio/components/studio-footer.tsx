import Link from "next/link";
import { ArrowUpRight, LockKeyhole } from "lucide-react";
import { studioNavigationProducts } from "@/features/studio/product-catalog";

export function StudioFooter() {
  return (
    <footer className="studio-footer">
      <div className="studio-footer__frame">
        <div className="studio-footer__lead">
          <Link className="studio-footer__brand" href="/" aria-label="Frameline home">Frameline</Link>
          <p>Private, immediate creator tools that run close to your work.</p>
          <span><LockKeyhole aria-hidden="true" /> Teleprompter: no account, no upload, free to use.</span>
        </div>
        <nav className="studio-footer__groups" aria-label="Footer navigation">
          <section aria-labelledby="footer-products-title">
            <h2 id="footer-products-title">Products</h2>
            <ul>
              {studioNavigationProducts.map((product) => (
                <li key={product.name}>
                  {product.availability === "available" ? <Link href={product.productHref}>{product.name}</Link> : <span>{product.name}</span>}
                  <small>{product.availability === "available" ? "Available" : "Coming soon"}</small>
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="footer-explore-title">
            <h2 id="footer-explore-title">Explore</h2>
            <ul>
              <li><Link href="/">Studio</Link></li>
              <li><Link href="/products">Products</Link></li>
              <li><Link href="/solutions">Solutions</Link></li>
              <li><Link href="/teleprompter">Teleprompter</Link></li>
            </ul>
          </section>
          <section aria-labelledby="footer-principles-title">
            <h2 id="footer-principles-title">Built around</h2>
            <ul className="studio-footer__principles">
              <li>Focused tools</li>
              <li>Private by default</li>
              <li>Client-side where practical</li>
              <li>Immediate access</li>
              <li>A free path to start</li>
            </ul>
          </section>
        </nav>
      </div>
      <div className="studio-footer__bottom">
        <p>© 2026 Frameline</p>
        <p>Teleprompter inputs and generated video stay on your device.</p>
        <Link href="/teleprompter/app">Open Teleprompter <ArrowUpRight aria-hidden="true" /></Link>
      </div>
    </footer>
  );
}
