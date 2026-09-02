import { countWords } from "@/lib/scripts/document";
import { createScriptTimeline } from "../rendering/plan";
import type { SessionState } from "../use-teleprompter-session";
import type { TeleprompterState } from "./teleprompter-state";

export function selectWordCount(state: TeleprompterState) {
  return countWords(state.text);
}

export function selectDurationSeconds(state: TeleprompterState) {
  if (selectWordCount(state) === 0) return 0;
  return Math.ceil(selectTimeline(state).wallClockDurationSeconds);
}

export function selectTimeline(state: TeleprompterState) {
  return createScriptTimeline(state.text, state.settings);
}

export function selectUnsupportedCapabilities(state: TeleprompterState) {
  return state.capabilities?.filter((capability) => !capability.supported) ?? [];
}

export function selectPreviewKey(state: TeleprompterState) {
  const { settings, text } = state;
  return JSON.stringify({
    text,
    wordsPerMinute: settings.wordsPerMinute,
    fontSize: settings.fontSize,
    lineHeight: settings.lineHeight,
    textColor: settings.textColor,
    backgroundColor: settings.backgroundColor,
    aspectRatio: settings.aspectRatio,
    horizontalPadding: settings.horizontalPadding,
    showGuide: settings.showGuide,
    showProgress: settings.showProgress,
    alignment: settings.alignment,
    leadInSeconds: settings.leadInSeconds,
  });
}

export function selectGenerationSignature(state: TeleprompterState) {
  const { settings, text } = state;
  return JSON.stringify({
    text,
    fontSize: settings.fontSize,
    lineHeight: settings.lineHeight,
    textColor: settings.textColor,
    backgroundColor: settings.backgroundColor,
    aspectRatio: settings.aspectRatio,
    horizontalPadding: settings.horizontalPadding,
    showGuide: settings.showGuide,
    showProgress: settings.showProgress,
    alignment: settings.alignment,
    leadInSeconds: settings.leadInSeconds,
  });
}

export function selectPreparedVideoIsStale(
  state: TeleprompterState,
  sessionState: SessionState,
) {
  return sessionState === "ready"
    && state.preparedSignature !== selectGenerationSignature(state);
}

export interface PrimaryActionState {
  label: string;
  ariaLabel: string;
  disabled: boolean;
}

export function selectPrimaryActionState(
  state: TeleprompterState,
  sessionState: SessionState,
  progress: number,
): PrimaryActionState {
  const stale = selectPreparedVideoIsStale(state, sessionState);
  const unsupported = selectUnsupportedCapabilities(state);
  const capabilitiesPending = state.capabilities === null;
  const cannotPrepare = !state.text.trim() || capabilitiesPending || unsupported.length > 0;

  if (sessionState === "generating") {
    return { label: `${progress}%`, ariaLabel: "Cancel preparation", disabled: false };
  }
  if (sessionState === "ready" && !stale) {
    return { label: "Float", ariaLabel: "Open floating teleprompter", disabled: false };
  }
  if (capabilitiesPending) {
    return { label: "Checking", ariaLabel: "Checking browser capabilities", disabled: true };
  }
  if (stale) {
    return { label: "Update", ariaLabel: "Recompile teleprompter", disabled: cannotPrepare };
  }
  return { label: "Prepare", ariaLabel: "Prepare floating teleprompter", disabled: cannotPrepare };
}

export function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}
