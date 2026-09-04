import Link from "next/link";
import { ArrowRight, Code2, Film, Focus, LockKeyhole, Sparkles, WandSparkles } from "lucide-react";

export function StudioHero() {
  return (
    <section className="studio-main studio-hero studio-hero--vision" aria-labelledby="studio-hero-title">
      <div className="studio-hero__copy">
        <p className="studio-eyebrow studio-hero__reveal studio-hero__reveal--one">A private creative toolkit</p>
        <h1 className="studio-hero__reveal studio-hero__reveal--two" id="studio-hero-title">
          Make the thing.<br /><em>Skip the setup.</em>
        </h1>
        <p className="studio-lede studio-hero__reveal studio-hero__reveal--three">
          Frameline is a growing studio of focused creator tools. Open what you need, work in your
          browser, and keep your files on your device whenever the job allows.
        </p>
        <div className="studio-actions studio-hero__reveal studio-hero__reveal--four">
          <Link className="studio-button" href="/products">Explore the tools <ArrowRight aria-hidden="true" /></Link>
          <Link className="studio-text-link" href="/teleprompter/app">Open Teleprompter</Link>
        </div>
      </div>
      <div className="studio-hero-orbit" aria-label="Frameline makes focused, private creator tools">
        <div className="studio-hero-orbit__halo" aria-hidden="true" />
        <article className="studio-hero-orbit__center">
          <span><Sparkles aria-hidden="true" /> Frameline</span>
          <h2>Your browser is a studio.</h2>
          <p>One clear job at a time.</p>
          <ul>
            <li><Focus aria-hidden="true" /> Focused</li>
            <li><LockKeyhole aria-hidden="true" /> Private by default</li>
          </ul>
        </article>
        <article className="studio-hero-tool studio-hero-tool--prompt"><strong>Teleprompter</strong><small>Available now</small></article>
        <article className="studio-hero-tool studio-hero-tool--code"><Code2 aria-hidden="true" /><strong>Code motion</strong><small>In the studio</small></article>
        <article className="studio-hero-tool studio-hero-tool--clip"><Film aria-hidden="true" /><strong>Clip extraction</strong><small>In the studio</small></article>
        <article className="studio-hero-tool studio-hero-tool--icon"><WandSparkles aria-hidden="true" /><strong>Icon motion</strong><small>In the studio</small></article>
      </div>
    </section>
  );
}
