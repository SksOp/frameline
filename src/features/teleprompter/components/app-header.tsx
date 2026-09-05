import Link from 'next/link';
import { LockKeyhole, Moon, Settings2, Sun } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { FramelineLogo } from '@/features/studio/components/frameline-logo';
import { formatDuration } from '../state/teleprompter-selectors';
import { ToolButton } from './tool-button';
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
    <header className="sticky top-0 z-5 grid min-h-[70px] grid-cols-[1fr_auto_1fr] items-center border-b border-divider bg-[color-mix(in_srgb,var(--canvas)_92%,transparent)] px-[14px] text-text-primary shadow-(--shadow-sm) backdrop-blur-[12px] max-[760px]:-mx-[14px] max-[760px]:min-h-[62px] max-[760px]:grid-cols-[1fr_auto]">
      <Link
        className="inline-flex w-max items-center gap-2 text-[1.375rem] leading-none font-bold tracking-[-0.045em] text-text-primary no-underline transition-[transform,color] duration-(--duration-standard) ease-(--ease-standard) hover:text-brand-coral-strong max-[760px]:text-xl"
        href="/teleprompter"
        aria-label="Frameline"
      >
        <FramelineLogo />
        <small className="border-l border-divider pl-2 font-sans text-[0.7rem] leading-none font-[650] tracking-normal text-text-secondary" aria-hidden="true">Teleprompter</small>
      </Link>
      <div className="flex items-center gap-2.5 font-mono text-[0.7rem] font-extrabold uppercase max-[760px]:hidden">
        <span>{words} words</span>
        <span className="text-brand-coral-strong" aria-hidden="true">/</span>
        <span>{formatDuration(duration)}</span>
      </div>
      <div className="flex items-center justify-end gap-2.5">
        {onToggleTheme && (
          <ToolButton
            iconOnly
            onClick={onToggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={`Theme: ${theme} (${resolvedTheme})`}
          >
            {isDark ? <Sun /> : <Moon />}
          </ToolButton>
        )}
        <Badge className="min-h-[30px] rounded-full border-border px-[9px] py-[5px] text-[0.65rem] shadow-none max-[760px]:px-1.5 max-[760px]:text-[0.6rem]" variant="secondary">
          <LockKeyhole /> Private
        </Badge>
        <ToolButton className="max-[760px]:hidden" onClick={onOpenSettings}>
          <Settings2 />
          <span>Settings</span>
        </ToolButton>
      </div>
    </header>
  );
}
