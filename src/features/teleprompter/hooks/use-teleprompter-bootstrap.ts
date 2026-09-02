"use client";

import { useEffect } from "react";
import { detectCapabilities } from "@/lib/client/capabilities";
import { useTeleprompterState } from "../state/teleprompter-context";
import { useDraftPersistence } from "./use-draft-persistence";
import { useSettingsPersistence } from "./use-settings-persistence";

export function useTeleprompterBootstrap() {
  const { state, dispatch } = useTeleprompterState();
  useDraftPersistence(dispatch, state.text, state.draftHydrated, state.draftDirty);
  useSettingsPersistence(dispatch, state.settings, state.settingsReady);

  useEffect(() => {
    let active = true;
    void detectCapabilities().then((capabilities) => {
      if (active) dispatch({ type: "capabilitiesResolved", capabilities });
    });
    return () => { active = false; };
  }, [dispatch]);

}
