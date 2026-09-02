import { FileText, MonitorPlay, PictureInPicture2, Play, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SessionState } from "../use-teleprompter-session";
import type { MobileView } from "../state/teleprompter-state";
import type { PrimaryActionState } from "../state/teleprompter-selectors";

type DockProps = {
  mobileView: MobileView; sessionState: SessionState; preparedVideoIsStale: boolean; action: PrimaryActionState;
  onMobileViewChange(view: MobileView): void; onOpenSettings(): void; onPrimaryAction(): void;
};

export function TeleprompterDock({ mobileView, sessionState, preparedVideoIsStale, action, onMobileViewChange, onOpenSettings, onPrimaryAction }: DockProps) {
  const ActionIcon = sessionState === "generating" ? X : sessionState === "ready" && !preparedVideoIsStale ? PictureInPicture2 : preparedVideoIsStale ? RotateCcw : Play;
  return <nav className="app-dock" aria-label="Teleprompter controls">
    <Button variant="ghost" className={mobileView === "script" ? "dock-item mobile-view-control active" : "dock-item mobile-view-control"} aria-pressed={mobileView === "script"} onClick={() => onMobileViewChange("script")}><FileText /><span>Script</span></Button>
    <Button variant="ghost" className={mobileView === "preview" ? "dock-item mobile-view-control active" : "dock-item mobile-view-control"} aria-pressed={mobileView === "preview"} onClick={() => onMobileViewChange("preview")}><MonitorPlay /><span>Preview</span></Button>
    <Button variant="ghost" className="dock-item" onClick={onOpenSettings}><SlidersHorizontal /><span>Tune</span></Button>
    <Button className={`dock-item dock-primary state-${sessionState}${preparedVideoIsStale ? " is-stale" : ""}`} disabled={action.disabled} onClick={onPrimaryAction} aria-label={action.ariaLabel}>
      <ActionIcon /><span>{action.label}</span>
    </Button>
  </nav>;
}
