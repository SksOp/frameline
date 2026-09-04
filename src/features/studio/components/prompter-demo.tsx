import { Check, CirclePlay, Sparkles } from "lucide-react";
import { teleprompter } from "../product-catalog";

const descriptions = [
  "Bring a rough draft or begin with a single sentence. It is saved locally in your browser.",
  "Tune the pace, type, colors, and reading window while a live preview keeps you oriented.",
  "Prepare the prompt video, open Android Picture-in-Picture, then record in your preferred camera app.",
] as const;

export function PrompterDemo() {
  return (
    <div className="prompter-demo">
      <header className="prompter-demo__header">
        <span className="prompter-demo__mark" aria-hidden="true">F</span><strong>Let&apos;s make a take</strong>
        <span className="prompter-demo__local"><Check aria-hidden="true" /> Local</span>
      </header>
      <div className="prompter-demo__steps">
        {teleprompter.workflow.map((step, index) => (
          <details key={step} open={index === 0}>
            <summary><span>0{index + 1}</span><strong>{step}</strong></summary>
            <p>{descriptions[index]}</p>
          </details>
        ))}
      </div>
      <div className="prompter-demo__workspace">
        <div className="prompter-demo__script">
          <p className="studio-eyebrow">Step 1 of 3</p><h3>What do you want to say?</h3>
          <p>Here&apos;s the part nobody tells you about starting:</p>
          <p>You don&apos;t need more confidence before you press record.</p>
          <p>You need a first sentence that feels like you.</p>
          <span><Check aria-hidden="true" /> Saved on your phone</span>
        </div>
        <div className="prompter-demo__practice">
          <p className="studio-eyebrow">Practice preview</p><h3>Find a pace that feels natural.</h3>
          <div className="prompter-demo__screen"><p>You don&apos;t need more confidence…</p><CirclePlay aria-hidden="true" /></div>
        </div>
      </div>
      <aside className="prompter-demo__tip">
        <Sparkles aria-hidden="true" /><p><strong>A little nudge</strong><br />Short lines are easier to deliver naturally. Try one thought per breath.</p>
      </aside>
    </div>
  );
}
