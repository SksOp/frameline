import type { Capability } from "@/lib/client/capabilities";
import { DEFAULT_SETTINGS, type TeleprompterSettings } from "../types";

export type MobileView = "script" | "preview";

export interface TeleprompterState {
  text: string;
  settings: TeleprompterSettings;
  capabilities: Capability[] | null;
  draftReady: boolean;
  draftHydrated: boolean;
  draftDirty: boolean;
  draftLoadInvalidated: boolean;
  draftPersistenceError: string | null;
  settingsReady: boolean;
  mobileView: MobileView;
  settingsOpen: boolean;
  previewPaused: boolean;
  preparedSignature: string | null;
}

export const INITIAL_TELEPROMPTER_STATE: TeleprompterState = {
  text: "",
  settings: DEFAULT_SETTINGS,
  capabilities: null,
  draftReady: false,
  draftHydrated: false,
  draftDirty: false,
  draftLoadInvalidated: false,
  draftPersistenceError: null,
  settingsReady: false,
  mobileView: "script",
  settingsOpen: false,
  previewPaused: false,
  preparedSignature: null,
};

type SettingChangedAction = {
  [Key in keyof TeleprompterSettings]: {
    type: "settingChanged";
    key: Key;
    value: TeleprompterSettings[Key];
  };
}[keyof TeleprompterSettings];

export type TeleprompterAction =
  | { type: "draftLoaded"; text: string }
  | { type: "draftUsabilityTimedOut" }
  | { type: "draftLoadFailed" }
  | { type: "draftTombstoneApplied" }
  | { type: "draftSaved"; text: string }
  | { type: "draftSaveFailed" }
  | { type: "draftClearFailed" }
  | { type: "draftPersistenceRecovered" }
  | { type: "textChanged"; text: string }
  | { type: "draftCleared" }
  | { type: "settingsHydrated"; settings: TeleprompterSettings }
  | SettingChangedAction
  | { type: "capabilitiesResolved"; capabilities: Capability[] }
  | { type: "mobileViewChanged"; view: MobileView }
  | { type: "settingsOpened" }
  | { type: "settingsClosed" }
  | { type: "previewPauseToggled" }
  | { type: "preparedSignatureCommitted"; signature: string };

export function settingChanged<Key extends keyof TeleprompterSettings>(
  key: Key,
  value: TeleprompterSettings[Key],
): TeleprompterAction {
  return { type: "settingChanged", key, value } as TeleprompterAction;
}
