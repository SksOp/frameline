"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { cn } from "cn";
import type { TeleprompterSettings } from "../types";
import type { SessionState } from "../use-teleprompter-session";
import { dimensionsFor, RENDER_FONT_FAMILY, RENDER_FONT_WEIGHT, type ScriptTimeline } from "../rendering/plan";
import { usePreviewRenderPlan } from "../hooks/use-preview-render-plan";
import { usePreviewScrub } from "../hooks/use-preview-scrub";
import { ToolButton } from "./tool-button";

type PreviewPaneProps = {
  text: string; settings: TeleprompterSettings; timeline: ScriptTimeline; previewKey: string;
  previewPaused: boolean; sessionState: SessionState; onTogglePause(): void; onPause(): void; preparedOutput?: ReactNode;
  mode?: "editor" | "studio";
  desktopVisible?: boolean;
};

/** Wheel deltas reported in lines rather than pixels are scaled by a typical line box. */
const WHEEL_LINE_PIXELS = 16;

export function PreviewPane({ text, settings, timeline, previewKey, previewPaused, sessionState, onTogglePause, onPause, preparedOutput, mode = "editor", desktopVisible = true }: PreviewPaneProps) {
  const [restartEpoch, setRestartEpoch] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ pointerId: number; lastY: number } | null>(null);
  const displayText = text || "Your words will scroll here as you type.";
  const studio = mode === "studio";
  const layoutSettings = useMemo(
    () => studio ? { ...settings, aspectRatio: "4:3" as const } : settings,
    [settings, studio],
  );
  const { viewportRef, layout } = usePreviewRenderPlan(displayText, layoutSettings, studio);
  const dimensions = dimensionsFor(settings.aspectRatio);
  const animationKey = `${previewKey}:${restartEpoch}`;
  const scrub = usePreviewScrub(stageRef, timeline);
  const scrollDistancePx = layout ? layout.scaled.startY - layout.scaled.endY : 0;
  const secondsPerPixel = scrollDistancePx > 0 ? timeline.playbackContentSeconds / scrollDistancePx : 0;
  /** Manual scrolling pauses the preview so the reader can inspect a passage; play resumes from there. */
  const scrubByPixels = (pixels: number) => {
    if (secondsPerPixel <= 0) return false;
    const moved = scrub.seekBy(pixels * secondsPerPixel);
    if (moved) onPause();
    return moved;
  };
  const scrubByPixelsRef = useRef(scrubByPixels);

  useEffect(() => {
    scrubByPixelsRef.current = scrubByPixels;
  });

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const onWheel = (event: WheelEvent) => {
      const pixels = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? event.deltaY * WHEEL_LINE_PIXELS : event.deltaY;
      if (scrubByPixelsRef.current(pixels)) event.preventDefault();
    };
    viewport.addEventListener("wheel", onWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", onWheel);
  }, [viewportRef]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    dragRef.current = { pointerId: event.pointerId, lastY: event.clientY };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const delta = drag.lastY - event.clientY;
    drag.lastY = event.clientY;
    if (delta !== 0) scrubByPixels(delta);
  };
  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };
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
  return <section className={cn(
    "min-h-0 min-w-0",
    studio
      ? "flex h-full w-full flex-1 items-stretch justify-center overflow-hidden"
      : "flex flex-1 flex-col border-l border-divider px-[var(--content-gutter)] py-6 max-[760px]:border-0 max-[760px]:px-4 max-[760px]:py-4 max-[760px]:group-data-[mobile-view=script]/stage:hidden",
    !studio && !desktopVisible && "min-[761px]:hidden",
  )} aria-labelledby={studio ? undefined : "preview-heading"} data-slot="preview-pane" data-mode={mode}>
    {!studio && <div className="mb-3 flex min-h-11 items-center justify-between gap-4">
      <h2 className="font-display text-2xl leading-none font-semibold tracking-[-0.025em]" id="preview-heading">Preview</h2>
      <div className="flex gap-1">
        <ToolButton iconOnly aria-label={previewPaused ? "Resume preview" : "Pause preview"} onClick={onTogglePause}>{previewPaused ? <Play /> : <Pause />}</ToolButton>
        <ToolButton iconOnly aria-label="Restart preview" onClick={() => setRestartEpoch((current) => current + 1)}><RotateCcw /></ToolButton>
      </div>
    </div>}
    <div className={cn(
      "relative grid place-items-center overflow-hidden bg-text-primary [container-type:size]",
      studio ? "h-full w-full" : "w-full rounded-lg shadow-[0_0_0_1px_var(--border),var(--shadow-sm)]",
    )} data-slot="preview" ref={stageRef} style={{ ...previewStyle, ...(studio ? {} : { aspectRatio: settings.aspectRatio.replace(":", "/") }) }}>
      <div className={cn(
        "relative overflow-hidden text-[length:var(--preview-font-size)] leading-[var(--preview-line-height)] select-none motion-safe:cursor-grab motion-safe:touch-none motion-safe:active:cursor-grabbing",
        studio ? "h-full w-full" : "aspect-[var(--preview-aspect)] w-[min(100cqw,calc(100cqh*var(--preview-aspect)))]",
      )} data-slot="preview-viewport" ref={viewportRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={endDrag} onPointerCancel={endDrag} style={{ color: settings.textColor, backgroundColor: settings.backgroundColor }} data-canonical-width={layout?.plan.width} data-canonical-height={layout?.plan.height} data-line-count={layout?.plan.lines.length}>
        {settings.showGuide && !studio && <>
          <i className="absolute top-1/2 left-3 z-2 h-[3px] w-[25px] border border-text-primary bg-accent-gold-soft shadow-[2px_2px_0_var(--brand-coral-soft)]" data-slot="guide" data-side="left" />
          <i className="absolute top-1/2 right-3 z-2 h-[3px] w-[25px] border border-text-primary bg-accent-gold-soft shadow-[2px_2px_0_var(--brand-coral-soft)]" data-slot="guide" data-side="right" />
        </>}
        <p key={`script:${animationKey}`} className="absolute top-0 right-[var(--preview-padding)] left-[var(--preview-padding)] m-0 text-[length:var(--preview-font-size)] leading-[var(--preview-line-height)] will-change-transform [animation:frameline-preview-scroll_var(--preview-duration)_linear_var(--preview-delay)_infinite_both] [animation-play-state:var(--preview-play-state)] motion-reduce:max-h-[calc(100%-12px)] motion-reduce:animate-none motion-reduce:overflow-auto motion-reduce:transform-none motion-reduce:will-change-auto" data-slot="preview-script" data-animation-key={animationKey} aria-label={displayText} style={{ textAlign: settings.alignment, fontFamily: RENDER_FONT_FAMILY, fontWeight: RENDER_FONT_WEIGHT }}>
          {(layout?.plan.lines ?? []).map((line, index) => <span className="block h-[var(--preview-line-height)] overflow-hidden whitespace-pre" data-slot="preview-line" data-blank={line === "" || undefined} key={`${index}:${line}`}>{line || "\u00a0"}</span>)}
        </p>
      </div>
      {settings.showProgress && <span key={`progress:${animationKey}`} className="absolute bottom-0 left-0 z-3 h-[7px] w-full border-t-2 border-text-primary bg-surface" data-slot="reading-progress-track" data-animation-key={animationKey} aria-hidden="true"><i className="block h-full w-full origin-left scale-x-0 bg-accent-gold-soft [animation:frameline-reading-progress_var(--preview-duration)_linear_var(--preview-delay)_infinite_both] [animation-play-state:var(--preview-play-state)] motion-reduce:animate-none motion-reduce:scale-x-0" data-slot="reading-progress" /></span>}
    </div>
    {!studio && preparedOutput}
    {studio && <div className="pointer-events-none fixed top-0 left-0 -z-10 size-px overflow-hidden opacity-0" aria-hidden="true">{preparedOutput}</div>}
  </section>;
}
