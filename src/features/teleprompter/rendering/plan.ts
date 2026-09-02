import type { TeleprompterSettings } from "../types";
import { wrapText, type TextMeasurer } from "./layout";
import { countWords } from "@/lib/scripts/document";

export const FPS = 30;
export const CANONICAL_WPM = 150;
export const RENDER_FONT_FAMILY = '"Inter Variable", sans-serif';
export const RENDER_FONT_WEIGHT = 600;

export function renderFont(fontSize: number) {
  return `${RENDER_FONT_WEIGHT} ${fontSize}px ${RENDER_FONT_FAMILY}`;
}

export interface RenderPlan {
  width: number; height: number; lines: readonly string[]; lineHeightPx: number;
  contentHeight: number; travel: number; durationSeconds: number; frameCount: number;
  leadInFrames: number; settings: Readonly<TeleprompterSettings>;
}

export interface ScaledRenderPlan {
  scale: number;
  fontSizePx: number;
  lineHeightPx: number;
  horizontalPaddingPx: number;
  startY: number;
  endY: number;
}

export interface ScriptTimeline {
  leadInSeconds: number;
  canonicalContentSeconds: number;
  encodedDurationSeconds: number;
  playbackContentSeconds: number;
  wallClockDurationSeconds: number;
  playbackRate: number;
}

export function createScriptTimeline(text: string, settings: Pick<TeleprompterSettings, "leadInSeconds" | "wordsPerMinute">): ScriptTimeline {
  const rate = playbackRate(settings.wordsPerMinute);
  const canonicalContentSeconds = Math.max(1, countWords(text) / CANONICAL_WPM * 60);
  const playbackContentSeconds = canonicalContentSeconds / rate;
  return Object.freeze({
    leadInSeconds: settings.leadInSeconds,
    canonicalContentSeconds,
    encodedDurationSeconds: settings.leadInSeconds + canonicalContentSeconds,
    playbackContentSeconds,
    wallClockDurationSeconds: settings.leadInSeconds + playbackContentSeconds,
    playbackRate: rate,
  });
}

export function dimensionsFor(aspect: TeleprompterSettings["aspectRatio"]) {
  if (aspect === "16:9") return { width: 800, height: 450 };
  if (aspect === "4:3") return { width: 720, height: 540 };
  return { width: 900, height: 300 };
}

export function horizontalPaddingPercent(settings: Pick<TeleprompterSettings, "aspectRatio" | "horizontalPadding">) {
  return settings.horizontalPadding / dimensionsFor(settings.aspectRatio).width * 100;
}

export function buildRenderPlan(text: string, settings: TeleprompterSettings, measure: TextMeasurer): RenderPlan {
  const { width, height } = dimensionsFor(settings.aspectRatio);
  const lines = wrapText(text, width - settings.horizontalPadding * 2, measure);
  const lineHeightPx = settings.fontSize * settings.lineHeight;
  const contentHeight = lines.length * lineHeightPx;
  const timeline = createScriptTimeline(text, settings);
  const durationSeconds = timeline.encodedDurationSeconds;
  return Object.freeze({
    width, height, lines: Object.freeze(lines), lineHeightPx, contentHeight,
    travel: contentHeight + height, durationSeconds,
    frameCount: Math.ceil(durationSeconds * FPS), leadInFrames: Math.round(settings.leadInSeconds * FPS),
    settings: Object.freeze({ ...settings }),
  });
}

export const createRenderPlan = buildRenderPlan;

export function scaleRenderPlan(plan: RenderPlan, viewportWidth: number): ScaledRenderPlan {
  const scale = viewportWidth > 0 ? viewportWidth / plan.width : 1;
  return Object.freeze({
    scale,
    fontSizePx: plan.settings.fontSize * scale,
    lineHeightPx: plan.lineHeightPx * scale,
    horizontalPaddingPx: plan.settings.horizontalPadding * scale,
    startY: plan.height * scale,
    endY: -plan.contentHeight * scale,
  });
}

export function timestampUs(frame: number): number { return Math.round((frame / FPS) * 1_000_000); }
export function playbackRate(wordsPerMinute: number) { return Math.min(2, Math.max(0.5, wordsPerMinute / CANONICAL_WPM)); }
export function playbackRateForMediaTime(mediaTime: number, leadInSeconds: number, wordsPerMinute: number) {
  return mediaTime < leadInSeconds ? 1 : playbackRate(wordsPerMinute);
}
