import type { ComponentProps } from "react";
import { FileText, MonitorPlay, PictureInPicture2, Play, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import type { SessionState } from "../use-teleprompter-session";
import type { MobileView } from "../state/teleprompter-state";
import type { PrimaryActionState } from "../state/teleprompter-selectors";

type DockProps = {
  mobileView: MobileView; sessionState: SessionState; preparedVideoIsStale: boolean; action: PrimaryActionState;
  onMobileViewChange(view: MobileView): void; onOpenSettings(): void; onPrimaryAction(): void;
};

function DockButton({ className, ...props }: Omit<ComponentProps<typeof Button>, "variant" | "size">) {
  return <Button variant="ghost" className={cn("flex h-auto min-w-0 flex-col items-center justify-center gap-[3px] rounded-md px-0 text-[0.6rem] font-[850] text-text-secondary shadow-none hover:border-brand-coral hover:bg-brand-coral-soft hover:text-text-primary [&_svg:not([class*='size-'])]:size-5 max-[760px]:rounded-sm", className)} {...props} />;
}

/** The dock's primary action carries the whole finite session state in its surface colours. */
function primaryActionClass(sessionState: SessionState, preparedVideoIsStale: boolean) {
  if (preparedVideoIsStale) return "border-warning bg-warning-surface text-warning hover:border-warning hover:bg-warning-surface hover:text-warning";
  if (sessionState === "generating") return "border-brand-coral-strong bg-danger text-text-inverted hover:border-brand-coral-strong hover:bg-danger hover:text-text-inverted";
  if (sessionState === "ready") return "border-positive bg-positive text-text-inverted hover:border-positive hover:bg-positive hover:text-text-inverted";
  return "border-brand-coral-strong bg-brand-coral-strong text-text-inverted hover:border-brand-coral-strong hover:bg-brand-coral hover:text-text-primary";
}

export function TeleprompterDock({ mobileView, sessionState, preparedVideoIsStale, action, onMobileViewChange, onOpenSettings, onPrimaryAction }: DockProps) {
  const ActionIcon = sessionState === "generating" ? X : sessionState === "ready" && !preparedVideoIsStale ? PictureInPicture2 : preparedVideoIsStale ? RotateCcw : Play;
  const mobileViewClass = "hidden aria-pressed:border-brand-coral aria-pressed:bg-brand-coral-soft aria-pressed:text-text-primary max-[760px]:flex";
  return <nav className="fixed bottom-[max(14px,env(safe-area-inset-bottom))] left-1/2 z-10 grid h-[76px] w-[min(440px,calc(100%-24px))] -translate-x-1/2 grid-cols-2 gap-[7px] rounded-xl border border-border bg-surface-elevated p-[7px] text-text-primary shadow-(--shadow-lg) max-[760px]:bottom-0 max-[760px]:h-[calc(72px+env(safe-area-inset-bottom))] max-[760px]:w-full max-[760px]:grid-cols-4 max-[760px]:rounded-none max-[760px]:border-x-0 max-[760px]:border-b-0 max-[760px]:px-2 max-[760px]:pt-1.5 max-[760px]:pb-[calc(6px+env(safe-area-inset-bottom))] max-[760px]:shadow-[0_-0.5rem_2rem_color-mix(in_srgb,var(--text-primary)_12%,transparent)]" aria-label="Teleprompter controls" data-slot="app-dock">
    <DockButton className={mobileViewClass} aria-pressed={mobileView === "script"} onClick={() => onMobileViewChange("script")}><FileText /><span>Script</span></DockButton>
    <DockButton className={mobileViewClass} aria-pressed={mobileView === "preview"} onClick={() => onMobileViewChange("preview")}><MonitorPlay /><span>Preview</span></DockButton>
    <DockButton onClick={onOpenSettings}><SlidersHorizontal /><span>Tune</span></DockButton>
    <DockButton className={primaryActionClass(sessionState, preparedVideoIsStale)} data-session-state={sessionState} data-stale={preparedVideoIsStale || undefined} disabled={action.disabled} onClick={onPrimaryAction} aria-label={action.ariaLabel}>
      <ActionIcon /><span>{action.label}</span>
    </DockButton>
  </nav>;
}
