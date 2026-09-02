import {
  INITIAL_TELEPROMPTER_STATE,
  type TeleprompterAction,
  type TeleprompterState,
} from "./teleprompter-state";

export function teleprompterReducer(
  state: TeleprompterState,
  action: TeleprompterAction,
): TeleprompterState {
  switch (action.type) {
    case "draftLoaded":
      return {
        ...state,
        text: state.draftDirty || state.draftLoadInvalidated ? state.text : action.text,
        draftReady: true,
        draftHydrated: true,
      };
    case "draftUsabilityTimedOut":
      return { ...state, draftReady: true };
    case "draftLoadFailed":
      return { ...state, draftReady: true, draftHydrated: true };
    case "draftTombstoneApplied":
      return {
        ...state,
        draftReady: true,
        draftHydrated: true,
        draftLoadInvalidated: true,
      };
    case "draftSaved":
      return state.text === action.text
        ? { ...state, draftDirty: false, draftPersistenceError: null }
        : state;
    case "draftSaveFailed":
      return { ...state, draftPersistenceError: "Your latest draft could not be saved on this device." };
    case "draftClearFailed":
      return { ...state, draftPersistenceError: "The stored draft could not be removed yet. Frameline will retry next time it opens." };
    case "draftPersistenceRecovered":
      return { ...state, draftPersistenceError: null };
    case "textChanged":
      return { ...state, text: action.text, draftDirty: true };
    case "draftCleared":
      return {
        ...state,
        text: "",
        draftReady: true,
        draftHydrated: true,
        draftDirty: false,
        draftLoadInvalidated: true,
        draftPersistenceError: null,
      };
    case "settingsHydrated":
      return { ...state, settings: action.settings, settingsReady: true };
    case "settingChanged":
      return {
        ...state,
        settings: { ...state.settings, [action.key]: action.value },
      };
    case "capabilitiesResolved":
      return { ...state, capabilities: action.capabilities };
    case "mobileViewChanged":
      return { ...state, mobileView: action.view };
    case "settingsOpened":
      return { ...state, settingsOpen: true };
    case "settingsClosed":
      return { ...state, settingsOpen: false };
    case "previewPauseToggled":
      return { ...state, previewPaused: !state.previewPaused };
    case "preparedSignatureCommitted":
      return { ...state, preparedSignature: action.signature };
  }
}

export { INITIAL_TELEPROMPTER_STATE };
