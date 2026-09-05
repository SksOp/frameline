import { Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { formatDuration } from "../state/teleprompter-selectors";
import { PaneHeader } from "./pane-header";
import { ToolButton } from "./tool-button";

type ScriptPaneProps = {
  text: string; draftReady: boolean; persistenceError: string | null; words: number; duration: number;
  onTextChange(text: string): void; onClear(): Promise<void>;
};

export function ScriptPane({ text, draftReady, persistenceError, words, duration, onTextChange, onClear }: ScriptPaneProps) {
  return <section className="min-w-0 border-r border-divider bg-surface px-7 pt-[26px] pb-[30px] max-[760px]:border-0 max-[760px]:bg-transparent max-[760px]:px-0 max-[760px]:pt-[14px] max-[760px]:pb-2 max-[760px]:group-data-[mobile-view=preview]/stage:hidden" aria-labelledby="script-heading" data-slot="script-pane">
    <PaneHeader kicker="Write" title="Your words" titleId="script-heading">
      <ToolButton onClick={() => void onClear()} disabled={!text} aria-label="Clear script"><Trash2 /><span>Clear</span></ToolButton>
    </PaneHeader>
    <label className="sr-only" htmlFor="script">Your script</label>
    <Textarea className="h-[calc(100dvh-304px)] min-h-[390px] field-sizing-fixed resize-none bg-surface-elevated p-[18px] font-mono text-[0.92rem] leading-[1.65] font-[550] text-text-primary shadow-[inset_0_1px_0_color-mix(in_srgb,var(--surface)_70%,transparent)] transition-[box-shadow,border-color,transform] duration-(--duration-standard) ease-(--ease-standard) placeholder:text-text-subtle hover:border-brand-coral hover:bg-surface-elevated hover:shadow-(--shadow-sm) focus-visible:shadow-(--shadow-sm) md:text-[0.92rem] max-[760px]:h-[calc(100dvh-238px)] max-[760px]:min-h-[320px] max-[760px]:p-[14px] max-[760px]:text-[0.82rem] max-[760px]:leading-[1.58] max-[760px]:shadow-(--shadow-sm)" id="script" value={text} disabled={!draftReady} onChange={(event) => onTextChange(event.target.value)} placeholder={draftReady ? "Paste or write your script…" : "Loading your local draft…"} />
    <div className="mt-[15px] flex justify-between gap-4 border-t border-divider pt-3 font-mono text-[0.64rem] font-[750] uppercase text-text-secondary max-[760px]:text-[0.58rem]"><span className="text-positive">{persistenceError ?? (draftReady ? "Saved on this device" : "Loading…")}</span><span>{words} words · {formatDuration(duration)}</span></div>
  </section>;
}
