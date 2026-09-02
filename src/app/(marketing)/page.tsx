import {
  ArrowDownRight,
  ArrowRight,
  Asterisk,
  AudioLines,
  ScanEye,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Link from "next/link";
import "./marketing.css";

export default function HomePage() {
  return (
    <main className="marketing">
      <nav className="marketing-nav" aria-label="Main navigation">
        <Link className="marketing-logo" href="/">FRAMELINE*</Link>
        <Link className="marketing-nav-cta" href="/teleprompter">
          <span>Skip to the good take</span><ArrowDownRight size={19}/>
        </Link>
      </nav>

      <section className="marketing-hero">
        <div className="marketing-copy">
          <div className="marketing-stamp"><Asterisk size={16}/> No cringe. All confidence.</div>
          <h1><span className="marketing-title-solid">Talk like</span><span className="marketing-title-fill">you mean it.</span></h1>
          <p className="marketing-lede">Your script floats over your camera so you can stop memorizing, start recording, and actually look alive.</p>
          <div className="marketing-actions">
            <Link className="marketing-primary" href="/teleprompter">Try it right now <Zap size={18}/></Link>
            <small>Free to start / no account / no script sent anywhere</small>
          </div>
        </div>
        <div className="marketing-art" aria-label="Animated preview of Frameline running over a phone camera">
          <div className="marketing-device-wrap">
            <div className="marketing-device">
              <div className="marketing-device-bar"><span>TAKE_03.MP4</span><span className="marketing-live">● LIVE</span></div>
              <div className="marketing-screen"><div className="marketing-face"/><div className="marketing-caption">Okay, here&apos;s the part nobody tells you—</div></div>
            </div>
          </div>
        </div>
      </section>

      <div className="marketing-ticker-shell" aria-label="Made for creator formats">
        <div className="marketing-ticker"><div>
          <span>Storytimes worth the plot twist</span><span>GRWMs without the ramble</span><span>Hot takes served confidently</span><span>Pitch decks with personality</span><span>Soft launches, hard eye contact</span>
          <span aria-hidden="true">Storytimes worth the plot twist</span><span aria-hidden="true">GRWMs without the ramble</span><span aria-hidden="true">Hot takes served confidently</span><span aria-hidden="true">Pitch decks with personality</span><span aria-hidden="true">Soft launches, hard eye contact</span>
        </div></div>
      </div>

      <section className="marketing-features" aria-labelledby="marketing-features-title">
        <div className="marketing-section-head">
          <h2 id="marketing-features-title">Brain off.<br/>Camera on.</h2>
          <p>Frameline handles the words so you can focus on the face, the energy, and the reason anyone should keep watching.</p>
        </div>
        <div className="marketing-grid">
          <article className="marketing-card"><div className="marketing-card-top"><ScanEye/><span>01</span></div><div><h3>Look at them</h3><p>Keep your words close to the lens. Less side-eye, more actual connection.</p></div></article>
          <article className="marketing-card"><div className="marketing-card-top"><AudioLines/><span>02</span></div><div><h3>Set your pace</h3><p>Dial in speed, type, colors, and timing until your delivery feels like you.</p></div></article>
          <article className="marketing-card"><div className="marketing-card-top"><ShieldCheck/><span>03</span></div><div><h3>Leave no trace</h3><p>Your draft stays on your device. We do not need to know what you are about to say.</p></div></article>
        </div>
      </section>

      <section className="marketing-trust" aria-labelledby="marketing-trust-title">
        <p>Private means private</p>
        <h2 id="marketing-trust-title">Your script never leaves your device.</h2>
        <div><span>NO ACCOUNT</span><span>NO UPLOAD</span><span>NO BACKEND COPY</span><span>ANDROID CHROME + HTTPS</span></div>
        <small>Frameline prepares the prompt video in your browser. Picture-in-Picture is an opaque Android system window, not a transparent overlay.</small>
      </section>

      <section className="marketing-final">
        <p>One less excuse to stay in drafts</p>
        <h2>Your next take is the take.</h2>
        <Link href="/teleprompter">Open Frameline <ArrowRight size={18}/></Link>
      </section>

      <footer className="marketing-footer"><b>FRAMELINE © 2026</b><span>Made for people with something to say.</span></footer>
    </main>
  );
}
