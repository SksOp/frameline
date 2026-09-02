import Link from "next/link";
import { LockKeyhole, Settings2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDuration } from "../state/teleprompter-selectors";

export function AppHeader({ words, duration, onOpenSettings }: { words: number; duration: number; onOpenSettings(): void }) {
  return <header className="app-header">
    <Link className="wordmark" href="/">Frameline</Link>
    <div className="app-header-meta"><span>{words} words</span><span>{formatDuration(duration)}</span></div>
    <div className="app-header-actions">
      <Badge className="privacy-pill" variant="ghost"><LockKeyhole /> Private</Badge>
      <Button className="tool-button desktop-settings" variant="ghost" onClick={onOpenSettings}><Settings2 /><span>Settings</span></Button>
    </div>
  </header>;
}
