import type { SessionState } from "../use-teleprompter-session";

export function PreparationStatus({ state, progress, stale }: { state: SessionState; progress: number; stale: boolean }) {
  let message = "Ready to prepare your teleprompter.";
  if (state === "generating") message = `Preparing video, ${Math.floor(progress / 25) * 25} percent complete.`;
  if (state === "ready") message = stale ? "Prepared video needs an update." : "Prepared video is ready.";
  if (state === "failed") message = "Video preparation failed.";
  if (state === "cancelled") message = "Video preparation cancelled.";
  return <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{message}</p>;
}
