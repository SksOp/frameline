"use client";

import { useTeleprompterState } from "../state/teleprompter-context";
import {
  selectDurationSeconds,
  selectGenerationSignature,
  selectPreparedVideoIsStale,
  selectPreviewKey,
  selectPrimaryActionState,
  selectTimeline,
  selectUnsupportedCapabilities,
  selectWordCount,
} from "../state/teleprompter-selectors";
import { useTeleprompterSession } from "../use-teleprompter-session";
import { usePreparedOutput } from "./use-prepared-output";
import { clearStoredDraft } from "./use-draft-persistence";
import { useTeleprompterBootstrap } from "./use-teleprompter-bootstrap";

export function useTeleprompterController() {
  const { state, dispatch } = useTeleprompterState();
  useTeleprompterBootstrap();
  const session = useTeleprompterSession(state.settings.wordsPerMinute);
  const generationSignature = selectGenerationSignature(state);
  const rememberPendingSignature = usePreparedOutput(session.state, dispatch);
  const preparedVideoIsStale = selectPreparedVideoIsStale(state, session.state);
  const primaryActionState = selectPrimaryActionState(state, session.state, session.progress);

  const clear = async () => {
    dispatch({ type: "draftCleared" });
    const cleared = await clearStoredDraft();
    dispatch({ type: cleared ? "draftPersistenceRecovered" : "draftClearFailed" });
  };

  const startPreparation = () => {
    rememberPendingSignature(generationSignature);
    session.prepare(state.text, state.settings);
  };

  const primaryAction = () => {
    if (session.state === "generating") {
      session.cancel();
      return;
    }
    if (session.state === "ready" && !preparedVideoIsStale) {
      void session.enterPip();
      return;
    }
    startPreparation();
  };

  return {
    state,
    dispatch,
    session,
    derived: {
      words: selectWordCount(state),
      duration: selectDurationSeconds(state),
      timeline: selectTimeline(state),
      unsupported: selectUnsupportedCapabilities(state),
      previewKey: selectPreviewKey(state),
      generationSignature,
      preparedVideoIsStale,
      primaryAction: primaryActionState,
    },
    clear,
    primaryAction,
  };
}
