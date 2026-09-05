import { Check, CirclePlay, Sparkles } from "lucide-react";
import { cn } from "cn";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { teleprompter } from "../product-catalog";
import { FramelineMark } from "./frameline-logo";

const descriptions = [
  "Bring a rough draft or begin with a single sentence. It is saved locally in your browser.",
  "Tune the pace, type, colors, and reading window while a live preview keeps you oriented.",
  "Prepare the prompt video, open Android Picture-in-Picture, then record in your preferred camera app.",
] as const;

export function PrompterDemo() {
  return (
    <Card className="gap-0 rounded-2xl py-0 shadow-(--shadow-lg)">
      <CardHeader className="flex min-h-18 grid-cols-none flex-row items-center gap-3 rounded-none border-b border-divider px-6 py-4">
        <FramelineMark className="size-8" size={32} />
        <strong>Let&apos;s make a take</strong>
        <span className="ml-auto inline-flex items-center gap-2 text-[0.8125rem] font-bold text-positive [&_svg]:w-4">
          <Check aria-hidden="true" /> Local
        </span>
      </CardHeader>
      <ol className="grid grid-cols-1 gap-3 border-b border-divider p-4 min-[42.001rem]:grid-cols-3">
        {teleprompter.workflow.map((step, index) => (
          <li
            className={cn("min-w-0 rounded-lg", index === 0 ? "bg-brand-coral-soft" : "bg-surface-inset")}
            key={step}
          >
            <div className="flex min-h-11 items-center gap-3 rounded-[inherit] p-3">
              <span className={cn("grid size-8 shrink-0 place-items-center rounded-full border font-mono text-[0.6875rem] font-semibold", index === 0 ? "border-brand-coral-strong" : "border-border")}>
                0{index + 1}
              </span>
              <strong>{step}</strong>
            </div>
            <p className="m-0 px-4 pb-4 text-sm leading-6 text-text-secondary">{descriptions[index]}</p>
          </li>
        ))}
      </ol>
      <CardContent className="grid grid-cols-1 gap-5 bg-surface-inset p-3 min-[42.001rem]:p-6 min-[58.001rem]:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl bg-surface-elevated p-[clamp(var(--space-6),5vw,var(--space-9))]">
          <p className="mb-3 text-[0.8125rem] font-[750] uppercase tracking-[0.08em] text-brand-coral-strong">Step 1 of 3</p>
          <h3 className="mb-8 font-display text-[clamp(2rem,4vw,3.5rem)] font-[560] leading-none tracking-[-0.04em]">What do you want to say?</h3>
          <p className="border-b border-divider py-3 leading-[1.6]">Here&apos;s the part nobody tells you about starting:</p>
          <p className="border-b border-divider py-3 leading-[1.6]">You don&apos;t need more confidence before you press record.</p>
          <p className="border-b border-divider py-3 leading-[1.6]">You need a first sentence that feels like you.</p>
          <span className="mt-8 flex items-center gap-2 text-[0.8125rem] font-bold text-positive [&_svg]:w-4">
            <Check aria-hidden="true" /> Saved on your phone
          </span>
        </div>
        <div className="group rounded-xl bg-accent-sage p-[clamp(var(--space-6),5vw,var(--space-9))]">
          <p className="mb-3 text-[0.8125rem] font-[750] uppercase tracking-[0.08em] text-brand-coral-strong">Practice preview</p>
          <h3 className="mb-8 font-display text-[clamp(2rem,4vw,3.5rem)] font-[560] leading-none tracking-[-0.04em]">Find a pace that feels natural.</h3>
          <div className="grid min-h-60 place-items-center rounded-lg bg-text-primary p-6 text-center text-text-inverted">
            <p className="max-w-96 font-bold">You don&apos;t need more confidence…</p>
            <CirclePlay className="size-11 text-accent-gold transition-transform duration-(--duration-standard) ease-(--ease-buoyant) group-hover:scale-110 motion-reduce:transition-none" aria-hidden="true" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="rounded-none border-0 bg-accent-gold p-0">
        <aside className="flex w-full items-start gap-4 px-6 py-4 min-[42.001rem]:items-center">
          <Sparkles className="shrink-0" aria-hidden="true" />
          <p className="m-0 text-sm text-text-secondary">
            <strong className="text-text-primary">A little nudge</strong>
            <br />Short lines are easier to deliver naturally. Try one thought per breath.
          </p>
        </aside>
      </CardFooter>
    </Card>
  );
}
