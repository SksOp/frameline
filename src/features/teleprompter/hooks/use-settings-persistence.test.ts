import { describe, expect, it, vi } from "vitest";
import { DEFAULT_SETTINGS } from "../types";
import {
  LEGACY_SETTINGS_STORAGE_KEY,
  SETTINGS_STORAGE_KEY,
  loadSettings,
  persistSettings,
  readStoredSettings,
} from "./use-settings-persistence";

describe("loadSettings", () => {
  it("migrates partial stored settings over current defaults", () => {
    expect(loadSettings(JSON.stringify({ wordsPerMinute: 180 }))).toEqual({
      ...DEFAULT_SETTINGS,
      wordsPerMinute: 180,
    });
  });

  it("falls back safely when storage is corrupt", () => {
    expect(loadSettings("not-json")).toEqual(DEFAULT_SETTINGS);
  });

  it("sanitizes every invalid type, domain, and range", () => {
    expect(loadSettings(JSON.stringify({
      fontSize: 900,
      lineHeight: "1.4",
      textColor: "red",
      backgroundColor: "#12345g",
      aspectRatio: "square",
      horizontalPadding: -2,
      showGuide: "true",
      showProgress: 1,
      alignment: "right",
      wordsPerMinute: Number.POSITIVE_INFINITY,
      leadInSeconds: 11,
      loop: null,
    }))).toEqual(DEFAULT_SETTINGS);
  });

  it("keeps migrated side padding inside the Tune control bounds", () => {
    expect(loadSettings(JSON.stringify({ horizontalPadding: 15 })).horizontalPadding).toBe(DEFAULT_SETTINGS.horizontalPadding);
    expect(loadSettings(JSON.stringify({ horizontalPadding: 121 })).horizontalPadding).toBe(DEFAULT_SETTINGS.horizontalPadding);
    expect(loadSettings(JSON.stringify({ horizontalPadding: 16 })).horizontalPadding).toBe(16);
    expect(loadSettings(JSON.stringify({ horizontalPadding: 120 })).horizontalPadding).toBe(120);
  });

  it("migrates sanitized legacy settings to the v2 key", () => {
    const values = new Map([[LEGACY_SETTINGS_STORAGE_KEY, JSON.stringify({ wordsPerMinute: 160 })]]);
    const storage = {
      getItem: vi.fn((key: string) => values.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => values.set(key, value)),
      removeItem: vi.fn((key: string) => { values.delete(key); }),
    };

    expect(readStoredSettings(storage)).toEqual({ ...DEFAULT_SETTINGS, wordsPerMinute: 160 });
    expect(storage.setItem).toHaveBeenCalledWith(
      SETTINGS_STORAGE_KEY,
      JSON.stringify({ ...DEFAULT_SETTINGS, wordsPerMinute: 160 }),
    );
    expect(storage.removeItem).toHaveBeenCalledWith(LEGACY_SETTINGS_STORAGE_KEY);
  });

  it("survives storage read and write exceptions", () => {
    const throwingStorage = {
      getItem: vi.fn(() => { throw new Error("blocked"); }),
      setItem: vi.fn(() => { throw new Error("full"); }),
      removeItem: vi.fn(),
    };
    expect(readStoredSettings(throwingStorage)).toEqual(DEFAULT_SETTINGS);
    expect(() => persistSettings(throwingStorage, DEFAULT_SETTINGS)).not.toThrow();
  });
});
