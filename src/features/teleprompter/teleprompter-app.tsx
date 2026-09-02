"use client";

import { TeleprompterWorkspace } from "./components/teleprompter-workspace";
import { TeleprompterProvider } from "./state/teleprompter-context";

export function TeleprompterApp() {
  return (
    <TeleprompterProvider>
      <TeleprompterWorkspace />
    </TeleprompterProvider>
  );
}
