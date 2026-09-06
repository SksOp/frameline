"use client";

import { useCallback, type RefObject } from "react";
import type { ScriptTimeline } from "../rendering/plan";

/** Keeps a seek just short of the end so an infinite animation does not wrap to its first frame. */
const END_GUARD_SECONDS = 0.05;

function previewAnimations(stage: HTMLElement | null): Animation[] {
  if (!stage || typeof stage.getAnimations !== "function") return [];
  return stage.getAnimations({ subtree: true });
}

function animationSeconds(animation: Animation) {
  const current = animation.currentTime;
  return typeof current === "number" && Number.isFinite(current) ? current / 1000 : 0;
}

/** Maps a raw animation time onto the visible lead-in + scroll pass, folding later loop iterations back into it. */
export function previewPositionSeconds(rawSeconds: number, timeline: Pick<ScriptTimeline, "leadInSeconds" | "playbackContentSeconds">) {
  const total = timeline.leadInSeconds + timeline.playbackContentSeconds;
  if (rawSeconds <= total || timeline.playbackContentSeconds <= 0) return Math.max(0, Math.min(total, rawSeconds));
  return timeline.leadInSeconds + ((rawSeconds - timeline.leadInSeconds) % timeline.playbackContentSeconds);
}

/**
 * Imperative seeking for the CSS-driven preview. The script scroll and the reading progress
 * bar are sibling animations under the stage, so seeking both keeps them in lockstep with
 * the same keyframes and timing the generated video uses.
 */
export function usePreviewScrub(stageRef: RefObject<HTMLElement | null>, timeline: ScriptTimeline) {
  const totalSeconds = timeline.leadInSeconds + timeline.playbackContentSeconds;

  const readPosition = useCallback(() => {
    const [first] = previewAnimations(stageRef.current);
    return first ? previewPositionSeconds(animationSeconds(first), timeline) : null;
  }, [stageRef, timeline]);

  const seekTo = useCallback((seconds: number) => {
    const animations = previewAnimations(stageRef.current);
    if (animations.length === 0 || !Number.isFinite(seconds)) return false;
    const clamped = Math.max(0, Math.min(Math.max(0, totalSeconds - END_GUARD_SECONDS), seconds));
    for (const animation of animations) animation.currentTime = clamped * 1000;
    return true;
  }, [stageRef, totalSeconds]);

  const seekBy = useCallback((offsetSeconds: number) => {
    const current = readPosition();
    return current === null ? false : seekTo(current + offsetSeconds);
  }, [readPosition, seekTo]);

  return { totalSeconds, readPosition, seekTo, seekBy };
}
