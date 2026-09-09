import { Textarea } from '@/components/ui/textarea';

type ScriptPaneProps = {
  text: string;
  draftReady: boolean;
  persistenceError: string | null;
  onTextChange(text: string): void;
};

export function ScriptPane({
  text,
  draftReady,
  persistenceError,
  onTextChange,
}: ScriptPaneProps) {
  return (
    <section
      className="flex min-h-0 min-w-0 flex-1 flex-col px-[var(--content-gutter)] py-6 max-[760px]:px-4 max-[760px]:py-4 max-[760px]:group-data-[mobile-view=preview]/stage:hidden"
      aria-labelledby="script-heading"
      data-slot="script-pane"
    >
      <h2 className="mb-3 font-display text-2xl leading-none font-semibold tracking-[-0.025em]" id="script-heading">Script</h2>
      <label className="sr-only" htmlFor="script">Your script</label>
      <Textarea
        className="min-h-[360px] flex-1 field-sizing-fixed resize-none rounded-none border-0 border-t border-divider bg-transparent px-0 py-5 font-mono text-base leading-[1.75] font-medium text-text-primary shadow-none transition-colors placeholder:text-text-subtle hover:bg-transparent focus-visible:border-focus focus-visible:ring-0 md:text-base max-[760px]:min-h-[calc(100dvh-152px)] max-[760px]:py-4 max-[760px]:text-[0.9rem] max-[760px]:leading-[1.7]"
        id="script"
        value={text}
        disabled={!draftReady}
        onChange={(event) => onTextChange(event.target.value)}
        placeholder={draftReady ? 'Paste or write your script…' : 'Loading your draft…'}
      />
      {persistenceError && <p className="mt-2 text-xs font-semibold text-danger" role="status">{persistenceError}</p>}
    </section>
  );
}
