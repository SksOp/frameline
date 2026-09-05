"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import type { TeleprompterSettings } from "../types";
import type { SessionState } from "../use-teleprompter-session";
import { dimensionsFor, RENDER_FONT_FAMILY, RENDER_FONT_WEIGHT, type ScriptTimeline } from "../rendering/plan";
import { usePreviewRenderPlan } from "../hooks/use-preview-render-plan";
import { PaneHeader } from "./pane-header";
import { ToolButton } from "./tool-button";

type PreviewPaneProps = {
  text: string; settings: TeleprompterSettings; timeline: ScriptTimeline; previewKey: string;
  previewPaused: boolean; sessionState: SessionState; onTogglePause(): void; preparedOutput?: ReactNode;
};

export function PreviewPane({ text, settings, timeline, previewKey, previewPaused, sessionState, onTogglePause, preparedOutput }: PreviewPaneProps) {
  const [restartEpoch, setRestartEpoch] = useState(0);
  const displayText = text || "Your words will scroll here as you type.";
  const { viewportRef, layout } = usePreviewRenderPlan(displayText, settings);
  const dimensions = dimensionsFor(settings.aspectRatio);
  const animationKey = `${previewKey}:${restartEpoch}`;
  const previewStyle = {
    "--preview-duration": `${timeline.playbackContentSeconds}s`, "--preview-delay": `${timeline.leadInSeconds}s`,
    "--preview-font-size": `${layout?.scaled.fontSizePx ?? settings.fontSize}px`,
    "--preview-line-height": `${layout?.scaled.lineHeightPx ?? settings.fontSize * settings.lineHeight}px`,
    "--preview-padding": `${layout?.scaled.horizontalPaddingPx ?? settings.horizontalPadding}px`,
    "--preview-start-y": `${layout?.scaled.startY ?? 0}px`, "--preview-end-y": `${layout?.scaled.endY ?? 0}px`,
    "--preview-scale": layout?.scaled.scale ?? 1,
    "--preview-aspect": dimensions.width / dimensions.height,
    "--preview-play-state": previewPaused || sessionState === "generating" ? "paused" : "running",
  } as CSSProperties;
  return <section className="min-w-0 bg-surface px-7 pt-[26px] pb-[30px] max-[760px]:flex max-[760px]:flex-col max-[760px]:bg-transparent max-[760px]:px-0 max-[760px]:pt-[14px] max-[760px]:pb-2 max-[760px]:group-data-[mobile-view=script]/stage:hidden" aria-labelledby="preview-heading" data-slot="preview-pane">
    <PaneHeader kicker="Practice" title="Reading window" titleId="preview-heading">
      <div className="flex gap-2">
        <ToolButton iconOnly aria-label={previewPaused ? "Resume preview" : "Pause preview"} onClick={onTogglePause}>{previewPaused ? <Play /> : <Pause />}</ToolButton>
        <ToolButton iconOnly aria-label="Restart preview" onClick={() => setRestartEpoch((current) => current + 1)}><RotateCcw /></ToolButton>
      </div>
    </PaneHeader>
    <div className="relative grid w-full place-items-center overflow-hidden rounded-lg border-none bg-text-primary shadow-[0_0_0_1px_var(--border),var(--shadow-sm)] [container-type:size]" data-slot="preview" style={{ ...previewStyle, aspectRatio: settings.aspectRatio.replace(":", "/") }}>
      <div className="relative aspect-[var(--preview-aspect)] w-[min(100cqw,calc(100cqh*var(--preview-aspect)))] overflow-hidden text-[length:var(--preview-font-size)] leading-[var(--preview-line-height)]" data-slot="preview-viewport" ref={viewportRef} style={{ color: settings.textColor, backgroundColor: settings.backgroundColor }} data-canonical-width={layout?.plan.width} data-canonical-height={layout?.plan.height} data-line-count={layout?.plan.lines.length}>
        {settings.showGuide && <>
          <i className="absolute top-1/2 left-3 z-2 h-[3px] w-[25px] border border-text-primary bg-accent-gold-soft shadow-[2px_2px_0_var(--brand-coral-soft)]" data-slot="guide" data-side="left" />
          <i className="absolute top-1/2 right-3 z-2 h-[3px] w-[25px] border border-text-primary bg-accent-gold-soft shadow-[2px_2px_0_var(--brand-coral-soft)]" data-slot="guide" data-side="right" />
        </>}
        <p key={`script:${animationKey}`} className="absolute top-0 right-[var(--preview-padding)] left-[var(--preview-padding)] m-0 text-[length:var(--preview-font-size)] leading-[var(--preview-line-height)] will-change-transform [animation:frameline-preview-scroll_var(--preview-duration)_linear_var(--preview-delay)_infinite_both] [animation-play-state:var(--preview-play-state)] motion-reduce:max-h-[calc(100%-12px)] motion-reduce:animate-none motion-reduce:overflow-auto motion-reduce:transform-none motion-reduce:will-change-auto" data-slot="preview-script" data-animation-key={animationKey} aria-label={displayText} style={{ textAlign: settings.alignment, fontFamily: RENDER_FONT_FAMILY, fontWeight: RENDER_FONT_WEIGHT }}>
          {(layout?.plan.lines ?? []).map((line, index) => <span className="block h-[var(--preview-line-height)] overflow-hidden whitespace-pre" data-slot="preview-line" data-blank={line === "" || undefined} key={`${index}:${line}`}>{line || "\u00a0"}</span>)}
        </p>
      </div>
      {settings.showProgress && <span key={`progress:${animationKey}`} className="absolute bottom-0 left-0 z-3 h-[7px] w-full border-t-2 border-text-primary bg-surface" data-slot="reading-progress-track" data-animation-key={animationKey} aria-hidden="true"><i className="block h-full w-full origin-left scale-x-0 bg-accent-gold-soft [animation:frameline-reading-progress_var(--preview-duration)_linear_var(--preview-delay)_infinite_both] [animation-play-state:var(--preview-play-state)] motion-reduce:animate-none motion-reduce:scale-x-0" data-slot="reading-progress" /></span>}
    </div>
    <p className="mx-0.5 mt-[15px] font-mono text-[0.64rem] leading-[1.5] font-bold uppercase text-text-secondary max-[760px]:mb-2" data-slot="preview-hint">{sessionState === "generating" ? "Preview paused while the video is prepared." : "Preview restarts when the script or reading controls change."}</p>
    {preparedOutput}
  </section>;
}
