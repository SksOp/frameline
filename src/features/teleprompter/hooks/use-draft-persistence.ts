"use client";

import { useEffect, useRef, type Dispatch } from "react";
import { draftStore } from "@/lib/client/draft-store";
import { createScriptDocument } from "@/lib/scripts/document";
import type { TeleprompterAction } from "../state/teleprompter-state";

export const DRAFT_CLEAR_TOMBSTONE_KEY = "frameline-draft-cleared";

function hasClearTombstone() {
  try { return window.localStorage.getItem(DRAFT_CLEAR_TOMBSTONE_KEY) === "1"; }
  catch { return false; }
}

function markClearTombstone() {
  try { window.localStorage.setItem(DRAFT_CLEAR_TOMBSTONE_KEY, "1"); }
  catch { /* IndexedDB failure is surfaced when no tombstone can be persisted. */ }
}

function removeClearTombstone() {
  try { window.localStorage.removeItem(DRAFT_CLEAR_TOMBSTONE_KEY); }
  catch { /* A stale tombstone only causes another safe clear attempt. */ }
}

export async function clearStoredDraft() {
  markClearTombstone();
  try {
    await draftStore.clear();
    removeClearTombstone();
    return true;
  } catch {
    return false;
  }
}

export function useDraftPersistence(
  dispatch: Dispatch<TeleprompterAction>,
  text: string,
  draftHydrated: boolean,
  draftDirty: boolean,
) {
  const recoveryBarrierRef = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    let active = true;
    const suppressStoredDraft = hasClearTombstone();
    const fallback = window.setTimeout(() => {
      if (active) dispatch({ type: "draftUsabilityTimedOut" });
    }, 800);

    void draftStore.load()
      .then((document) => {
        if (!active) return;
        if (suppressStoredDraft) {
          dispatch({ type: "draftTombstoneApplied" });
          recoveryBarrierRef.current = draftStore.clear()
            .then(removeClearTombstone)
            .catch(() => undefined);
          return;
        }
        dispatch({ type: "draftLoaded", text: document.body });
      })
      .catch(() => {
        if (active) dispatch({ type: "draftLoadFailed" });
      })
      .finally(() => {
        window.clearTimeout(fallback);
      });

    return () => {
      active = false;
      window.clearTimeout(fallback);
    };
  }, [dispatch]);

  useEffect(() => {
    if (!draftHydrated || !draftDirty) return;
    let active = true;
    let attempt = 0;
    let timer: number;
    const retryDelays = [500, 1_000, 2_000] as const;

    const save = () => {
      void recoveryBarrierRef.current
        .then(() => {
          if (!active) return;
          return draftStore.save(createScriptDocument(text));
        })
        .then(() => {
          if (active) {
            removeClearTombstone();
            dispatch({ type: "draftSaved", text });
          }
        })
        .catch(() => {
          if (!active) return;
          attempt += 1;
          if (attempt < retryDelays.length) {
            timer = window.setTimeout(save, retryDelays[attempt]);
          } else {
            dispatch({ type: "draftSaveFailed" });
          }
        });
    };

    timer = window.setTimeout(save, retryDelays[attempt]);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [dispatch, draftDirty, draftHydrated, text]);
}
