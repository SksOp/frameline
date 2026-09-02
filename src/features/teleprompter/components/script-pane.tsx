import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDuration } from "../state/teleprompter-selectors";

type ScriptPaneProps = {
  text: string; draftReady: boolean; persistenceError: string | null; words: number; duration: number;
  onTextChange(text: string): void; onClear(): Promise<void>;
};

export function ScriptPane({ text, draftReady, persistenceError, words, duration, onTextChange, onClear }: ScriptPaneProps) {
  return <section className="app-pane script-pane" aria-labelledby="script-heading">
    <div className="pane-toolbar">
      <div><span className="pane-kicker">Script</span><h2 id="script-heading">Your words</h2></div>
      <Button className="tool-button" variant="ghost" onClick={() => void onClear()} disabled={!text} aria-label="Clear script"><Trash2 /><span>Clear</span></Button>
    </div>
    <label className="sr-only" htmlFor="script">Your script</label>
    <Textarea className="script-editor" id="script" value={text} disabled={!draftReady} onChange={(event) => onTextChange(event.target.value)} placeholder={draftReady ? "Paste or write your script…" : "Loading your local draft…"} />
    <div className="script-status"><span>{persistenceError ?? (draftReady ? "Saved on this device" : "Loading…")}</span><span>{words} words · {formatDuration(duration)}</span></div>
  </section>;
}
