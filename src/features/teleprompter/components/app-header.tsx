import Link from 'next/link';
import { LockKeyhole, Moon, Settings2, Sun } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FramelineLogo } from '@/features/studio/components/frameline-logo';
import { formatDuration } from '../state/teleprompter-selectors';
import type { ResolvedTheme, ThemePreference } from '../hooks/use-theme';

interface AppHeaderProps {
  words: number;
  duration: number;
  onOpenSettings(): void;
  theme?: ThemePreference;
  resolvedTheme?: ResolvedTheme;
  onToggleTheme?(): void;
}

export function AppHeader({
  words,
  duration,
  onOpenSettings,
  theme = 'system',
  resolvedTheme = 'light',
  onToggleTheme,
}: AppHeaderProps) {
  const isDark = resolvedTheme === 'dark';
  return (
    <header className="app-header">
      <Link className="wordmark text-[1.375rem] leading-none font-bold tracking-[-0.045em] no-underline" href="/teleprompter" aria-label="Frameline">
        <FramelineLogo />
        <small aria-hidden="true">Teleprompter</small>
      </Link>
      <div className="app-header-meta">
        <span>{words} words</span>
        <span>{formatDuration(duration)}</span>
      </div>
      <div className="app-header-actions">
        {onToggleTheme && (
          <Button
            className="tool-button theme-toggle"
            variant="ghost"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={`Theme: ${theme} (${resolvedTheme})`}
          >
            {isDark ? <Sun /> : <Moon />}
          </Button>
        )}
        <Badge className="privacy-pill" variant="ghost">
          <LockKeyhole /> Private
        </Badge>
        <Button
          className="tool-button desktop-settings"
          variant="ghost"
          onClick={onOpenSettings}
        >
          <Settings2 />
          <span>Settings</span>
        </Button>
      </div>
    </header>
  );
}
