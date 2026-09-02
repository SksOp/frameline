"use client";

import { useCallback, useEffect, useRef, type Dispatch } from "react";
import type { SessionState } from "../use-teleprompter-session";
import type { TeleprompterAction } from "../state/teleprompter-state";

export function usePreparedOutput(
  sessionState: SessionState,
  dispatch: Dispatch<TeleprompterAction>,
) {
  const pendingSignatureRef = useRef<string | null>(null);

  useEffect(() => {
    if (sessionState === "ready" && pendingSignatureRef.current) {
      dispatch({
        type: "preparedSignatureCommitted",
        signature: pendingSignatureRef.current,
      });
      pendingSignatureRef.current = null;
    } else if (sessionState === "failed" || sessionState === "cancelled") {
      pendingSignatureRef.current = null;
    }
  }, [dispatch, sessionState]);

  return useCallback((signature: string) => {
    pendingSignatureRef.current = signature;
  }, []);
}
