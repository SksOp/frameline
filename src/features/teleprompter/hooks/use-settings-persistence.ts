"use client";

import { useEffect, type Dispatch } from "react";
import { DEFAULT_SETTINGS, HORIZONTAL_PADDING_BOUNDS, type TeleprompterSettings } from "../types";
import type { TeleprompterAction } from "../state/teleprompter-state";

export const SETTINGS_STORAGE_KEY = "frameline-settings-v2";
export const LEGACY_SETTINGS_STORAGE_KEY = "frameline-settings";

type SettingsStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function numberInRange(value: unknown, minimum: number, maximum: number) {
  return typeof value === "number" && Number.isFinite(value) && value >= minimum && value <= maximum;
}

function color(value: unknown, fallback: string) {
  return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value) ? value : fallback;
}

export function sanitizeSettings(value: unknown): TeleprompterSettings {
  if (!isRecord(value)) return { ...DEFAULT_SETTINGS };
  return {
    fontSize: numberInRange(value.fontSize, 36, 90) ? value.fontSize as number : DEFAULT_SETTINGS.fontSize,
    lineHeight: numberInRange(value.lineHeight, 1, 1.8) ? value.lineHeight as number : DEFAULT_SETTINGS.lineHeight,
    textColor: color(value.textColor, DEFAULT_SETTINGS.textColor),
    backgroundColor: color(value.backgroundColor, DEFAULT_SETTINGS.backgroundColor),
    aspectRatio: value.aspectRatio === "3:1" || value.aspectRatio === "16:9" || value.aspectRatio === "4:3"
      ? value.aspectRatio
      : DEFAULT_SETTINGS.aspectRatio,
    horizontalPadding: numberInRange(value.horizontalPadding, HORIZONTAL_PADDING_BOUNDS.min, HORIZONTAL_PADDING_BOUNDS.max)
      ? value.horizontalPadding as number
      : DEFAULT_SETTINGS.horizontalPadding,
    showGuide: typeof value.showGuide === "boolean" ? value.showGuide : DEFAULT_SETTINGS.showGuide,
    showProgress: typeof value.showProgress === "boolean" ? value.showProgress : DEFAULT_SETTINGS.showProgress,
    alignment: value.alignment === "left" || value.alignment === "center"
      ? value.alignment
      : DEFAULT_SETTINGS.alignment,
    wordsPerMinute: numberInRange(value.wordsPerMinute, 75, 300)
      ? value.wordsPerMinute as number
      : DEFAULT_SETTINGS.wordsPerMinute,
    leadInSeconds: numberInRange(value.leadInSeconds, 0, 10)
      ? value.leadInSeconds as number
      : DEFAULT_SETTINGS.leadInSeconds,
    loop: typeof value.loop === "boolean" ? value.loop : DEFAULT_SETTINGS.loop,
  };
}

export function loadSettings(value: string | null): TeleprompterSettings {
  if (!value) return { ...DEFAULT_SETTINGS };
  try {
    return sanitizeSettings(JSON.parse(value));
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function readStoredSettings(storage: SettingsStorage): TeleprompterSettings {
  try {
    const current = storage.getItem(SETTINGS_STORAGE_KEY);
    if (current !== null) return loadSettings(current);

    const legacy = storage.getItem(LEGACY_SETTINGS_STORAGE_KEY);
    const settings = loadSettings(legacy);
    if (legacy !== null) {
      try {
        storage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
        storage.removeItem(LEGACY_SETTINGS_STORAGE_KEY);
      } catch {
        // Storage can be unavailable in private or constrained browser contexts.
      }
    }
    return settings;
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function persistSettings(storage: SettingsStorage, settings: TeleprompterSettings) {
  try {
    storage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Settings remain usable for this session when persistence is unavailable.
  }
}

export function useSettingsPersistence(
  dispatch: Dispatch<TeleprompterAction>,
  settings: TeleprompterSettings,
  settingsReady: boolean,
) {
  useEffect(() => {
    let storedSettings = { ...DEFAULT_SETTINGS };
    try {
      storedSettings = readStoredSettings(window.localStorage);
    } catch {
      // Accessing the Storage object itself can throw in restricted contexts.
    }
    dispatch({ type: "settingsHydrated", settings: storedSettings });
  }, [dispatch]);

  useEffect(() => {
    if (!settingsReady) return;
    try {
      persistSettings(window.localStorage, settings);
    } catch {
      // Keep the in-memory settings usable when Storage access is blocked.
    }
  }, [settings, settingsReady]);
}
