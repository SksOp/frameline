import type { TeleprompterSettings } from "../types";
import { wrapText, type TextMeasurer } from "./layout";

export const FPS = 30;
export const CANONICAL_WPM = 150;

export interface RenderPlan {
  width: number; height: number; lines: readonly string[]; lineHeightPx: number;
  contentHeight: number; travel: number; durationSeconds: number; frameCount: number;
  leadInFrames: number; settings: Readonly<TeleprompterSettings>;
}

export function dimensionsFor(aspect: TeleprompterSettings["aspectRatio"]) {
  if (aspect === "16:9") return { width: 800, height: 450 };
  if (aspect === "4:3") return { width: 720, height: 540 };
  return { width: 900, height: 300 };
}

export function createRenderPlan(text: string, settings: TeleprompterSettings, measure: TextMeasurer): RenderPlan {
  const { width, height } = dimensionsFor(settings.aspectRatio);
  const lines = wrapText(text, width - settings.horizontalPadding * 2, measure);
  const lineHeightPx = settings.fontSize * settings.lineHeight;
  const contentHeight = lines.length * lineHeightPx;
  const spokenSeconds = Math.max(1, text.trim().split(/\s+/u).filter(Boolean).length / CANONICAL_WPM * 60);
  const durationSeconds = settings.leadInSeconds + spokenSeconds;
  return Object.freeze({
    width, height, lines: Object.freeze(lines), lineHeightPx, contentHeight,
    travel: contentHeight + height, durationSeconds,
    frameCount: Math.ceil(durationSeconds * FPS), leadInFrames: Math.round(settings.leadInSeconds * FPS),
    settings: Object.freeze({ ...settings }),
  });
}

export function timestampUs(frame: number): number { return Math.round((frame / FPS) * 1_000_000); }
export function playbackRate(wordsPerMinute: number) { return Math.min(2, Math.max(0.5, wordsPerMinute / CANONICAL_WPM)); }
