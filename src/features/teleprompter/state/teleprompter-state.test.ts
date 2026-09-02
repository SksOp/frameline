import { describe, expect, it } from "vitest";
import type { Capability } from "@/lib/client/capabilities";
import type { SessionState } from "../use-teleprompter-session";
import { DEFAULT_SETTINGS } from "../types";
import { INITIAL_TELEPROMPTER_STATE, teleprompterReducer } from "./teleprompter-reducer";
import {
  selectGenerationSignature,
  selectDurationSeconds,
  selectPreparedVideoIsStale,
  selectPreviewKey,
  selectPrimaryActionState,
  selectUnsupportedCapabilities,
} from "./teleprompter-selectors";
import { settingChanged, type TeleprompterState } from "./teleprompter-state";

function readyState(overrides: Partial<TeleprompterState> = {}): TeleprompterState {
  return {
    ...INITIAL_TELEPROMPTER_STATE,
    draftReady: true,
    settingsReady: true,
    capabilities: [],
    text: "one two three",
    ...overrides,
  };
}

describe("teleprompterReducer", () => {
  it("coordinates serializable application state through closed actions", () => {
    let state = teleprompterReducer(INITIAL_TELEPROMPTER_STATE, {
      type: "draftLoaded",
      text: "Hello camera",
    });
    state = teleprompterReducer(state, settingChanged("fontSize", 58));
    state = teleprompterReducer(state, { type: "settingsOpened" });
    state = teleprompterReducer(state, { type: "previewPauseToggled" });

    expect(state).toMatchObject({
      text: "Hello camera",
      draftReady: true,
      settingsOpen: true,
      previewPaused: true,
      settings: { fontSize: 58 },
    });
  });

  it("hydrates persisted settings over the defaults", () => {
    const settings = { ...DEFAULT_SETTINGS, wordsPerMinute: 175, loop: true };
    const state = teleprompterReducer(INITIAL_TELEPROMPTER_STATE, {
      type: "settingsHydrated",
      settings,
    });
    expect(state.settings).toEqual(settings);
    expect(state.settingsReady).toBe(true);
  });

  it("keeps edits made after the usability timeout when a slow draft finally loads", () => {
    let state = teleprompterReducer(INITIAL_TELEPROMPTER_STATE, {
      type: "draftUsabilityTimedOut",
    });
    state = teleprompterReducer(state, { type: "textChanged", text: "New local edit" });
    state = teleprompterReducer(state, { type: "draftLoaded", text: "Older stored draft" });

    expect(state).toMatchObject({
      text: "New local edit",
      draftReady: true,
      draftHydrated: true,
      draftDirty: true,
    });
  });

  it("distinguishes an explicit clear from pristine state and ignores an in-flight load", () => {
    let state = teleprompterReducer(INITIAL_TELEPROMPTER_STATE, { type: "draftCleared" });
    state = teleprompterReducer(state, { type: "draftLoaded", text: "Old stored draft" });
    expect(state).toMatchObject({
      text: "",
      draftHydrated: true,
      draftLoadInvalidated: true,
    });
  });
});

describe("teleprompter selectors", () => {
  it("shows zero duration for an empty script without changing nonempty timing", () => {
    expect(selectDurationSeconds(readyState({ text: "" }))).toBe(0);
    expect(selectDurationSeconds(readyState({ text: "one two three" }))).toBeGreaterThan(0);
  });
  it("excludes playback-only speed and looping from the generated-output signature", () => {
    const original = readyState();
    const playbackChanged = readyState({
      settings: { ...DEFAULT_SETTINGS, wordsPerMinute: 260, loop: true },
    });
    expect(selectGenerationSignature(playbackChanged)).toBe(selectGenerationSignature(original));
  });

  it("marks visual and timing changes stale", () => {
    const prepared = readyState();
    const signature = selectGenerationSignature(prepared);
    const withPreparedOutput = { ...prepared, preparedSignature: signature };
    expect(selectPreparedVideoIsStale(withPreparedOutput, "ready")).toBe(false);

    const visuallyChanged = {
      ...withPreparedOutput,
      settings: { ...withPreparedOutput.settings, showProgress: false },
    };
    expect(selectPreparedVideoIsStale(visuallyChanged, "ready")).toBe(true);
  });

  it("restarts preview timing when timeline or layout inputs change", () => {
    const original = readyState();
    const originalKey = selectPreviewKey(original);
    for (const settings of [
      { ...original.settings, leadInSeconds: 4 },
      { ...original.settings, showProgress: false },
      { ...original.settings, horizontalPadding: 100 },
      { ...original.settings, aspectRatio: "16:9" as const },
      { ...original.settings, backgroundColor: "#000000" },
    ]) {
      expect(selectPreviewKey({ ...original, settings })).not.toBe(originalKey);
    }
  });

  it("derives unsupported capabilities and every primary action state", () => {
    const capabilities: Capability[] = [
      { key: "worker", label: "Worker", supported: false, recovery: "Upgrade" },
    ];
    const blocked = readyState({ capabilities });
    expect(selectUnsupportedCapabilities(blocked)).toHaveLength(1);
    expect(selectPrimaryActionState(blocked, "idle", 0)).toMatchObject({
      label: "Prepare",
      disabled: true,
    });
    expect(selectPrimaryActionState(blocked, "generating", 42)).toMatchObject({
      label: "42%",
      disabled: false,
    });

    expect(selectPrimaryActionState(readyState({ capabilities: null }), "idle", 0)).toEqual({
      label: "Checking",
      ariaLabel: "Checking browser capabilities",
      disabled: true,
    });

    const prepared = readyState();
    prepared.preparedSignature = selectGenerationSignature(prepared);
    expect(selectPrimaryActionState(prepared, "ready", 100).label).toBe("Float");
    const stale = { ...prepared, text: "changed" };
    expect(selectPrimaryActionState(stale, "ready", 100).label).toBe("Update");
    expect(selectPrimaryActionState({ ...stale, text: "  " }, "ready", 100).disabled).toBe(true);
    expect(selectPrimaryActionState({ ...stale, capabilities }, "ready", 100).disabled).toBe(true);

    const freshButNowUnsupported = { ...prepared, capabilities };
    expect(selectPrimaryActionState(freshButNowUnsupported, "ready", 100)).toMatchObject({
      label: "Float",
      disabled: false,
    });
    expect(selectPrimaryActionState({ ...prepared, capabilities: null }, "ready", 100)).toMatchObject({ label: "Float", disabled: false });
  });

  it.each<SessionState>(["idle", "generating", "ready", "failed", "cancelled"])(
    "keeps stale status false outside a ready session (%s)",
    (sessionState) => {
      if (sessionState === "ready") return;
      expect(selectPreparedVideoIsStale(readyState(), sessionState)).toBe(false);
    },
  );
});
