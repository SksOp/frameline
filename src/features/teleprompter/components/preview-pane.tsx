"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TeleprompterSettings } from "../types";
import type { SessionState } from "../use-teleprompter-session";
import { dimensionsFor, RENDER_FONT_FAMILY, RENDER_FONT_WEIGHT, type ScriptTimeline } from "../rendering/plan";
import { usePreviewRenderPlan } from "../hooks/use-preview-render-plan";

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
  return <section className="app-pane preview-pane" aria-labelledby="preview-heading">
    <div className="pane-toolbar preview-toolbar">
      <div><span className="pane-kicker">Live preview</span><h2 id="preview-heading">Reading window</h2></div>
      <div className="preview-tools">
        <Button className="tool-button icon-only" size="icon-lg" variant="ghost" aria-label={previewPaused ? "Resume preview" : "Pause preview"} onClick={onTogglePause}>{previewPaused ? <Play /> : <Pause />}</Button>
        <Button className="tool-button icon-only" size="icon-lg" variant="ghost" aria-label="Restart preview" onClick={() => setRestartEpoch((current) => current + 1)}><RotateCcw /></Button>
      </div>
    </div>
    <div className="preview" style={{ ...previewStyle, aspectRatio: settings.aspectRatio.replace(":", "/") }}>
      <div className="preview-viewport" ref={viewportRef} style={{ color: settings.textColor, backgroundColor: settings.backgroundColor }} data-canonical-width={layout?.plan.width} data-canonical-height={layout?.plan.height} data-line-count={layout?.plan.lines.length}>
        {settings.showGuide && <><i className="guide left" /><i className="guide right" /></>}
        <p key={`script:${animationKey}`} className="preview-script" data-animation-key={animationKey} aria-label={displayText} style={{ textAlign: settings.alignment, fontFamily: RENDER_FONT_FAMILY, fontWeight: RENDER_FONT_WEIGHT }}>
          {(layout?.plan.lines ?? []).map((line, index) => <span className="preview-line" data-blank={line === "" || undefined} key={`${index}:${line}`}>{line || "\u00a0"}</span>)}
        </p>
      </div>
      {settings.showProgress && <span key={`progress:${animationKey}`} className="reading-progress-track" data-animation-key={animationKey} aria-hidden="true"><i className="reading-progress" /></span>}
    </div>
    <p className="preview-hint">{sessionState === "generating" ? "Preview paused while the video is prepared." : "Preview restarts when the script or reading controls change."}</p>
    {preparedOutput}
  </section>;
}
