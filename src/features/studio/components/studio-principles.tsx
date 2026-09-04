import { Focus, LockKeyhole, Zap } from "lucide-react";

const principles = [
  { title: "Focused", copy: "One clear job per tool, with the creator's work—not our interface—at the center.", icon: Focus },
  { title: "Private", copy: "Teleprompter saves and prepares locally. Your script is never uploaded to Frameline.", icon: LockKeyhole },
  { title: "Immediate", copy: "No account ceremony. Open the tool, bring your words, and start making the take.", icon: Zap },
] as const;

export function StudioPrinciples() {
  return (
    <section className="studio-principles" aria-labelledby="principles-title">
      <div className="studio-main">
        <div className="studio-section-heading studio-section-heading--light">
          <div><p className="studio-eyebrow">How we build</p><h2 id="principles-title">Creator care, built in.</h2></div>
          <p>A warm invitation outside. A clear, quiet journey once you are making.</p>
        </div>
        <div className="studio-principles__grid">
          {principles.map(({ title, copy, icon: Icon }, index) => (
            <article key={title}>
              <span>0{index + 1}</span><Icon aria-hidden="true" /><h3>{title}</h3><p>{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
