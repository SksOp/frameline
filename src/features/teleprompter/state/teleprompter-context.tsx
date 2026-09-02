"use client";

import {
  createContext,
  type Dispatch,
  type ReactNode,
  useContext,
  useMemo,
  useReducer,
} from "react";
import { INITIAL_TELEPROMPTER_STATE, teleprompterReducer } from "./teleprompter-reducer";
import type { TeleprompterAction, TeleprompterState } from "./teleprompter-state";

interface TeleprompterContextValue {
  state: TeleprompterState;
  dispatch: Dispatch<TeleprompterAction>;
}

const TeleprompterContext = createContext<TeleprompterContextValue | null>(null);

export function TeleprompterProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(teleprompterReducer, INITIAL_TELEPROMPTER_STATE);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <TeleprompterContext.Provider value={value}>{children}</TeleprompterContext.Provider>;
}

export function useTeleprompterState() {
  const value = useContext(TeleprompterContext);
  if (!value) throw new Error("useTeleprompterState must be used inside TeleprompterProvider");
  return value;
}
