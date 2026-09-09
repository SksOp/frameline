'use client';

import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import {
  AppWindow,
  Check,
  Eye,
  EyeOff,
  FilePenLine,
  Home,
  Maximize2,
  Pause,
  PictureInPicture2,
  Play,
  RefreshCcw,
  SlidersHorizontal,
  Trash2,
  X,
} from 'lucide-react';
import { cn } from 'cn';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FramelineMark } from '@/features/studio/components/frameline-logo';
import type { SessionState } from '../use-teleprompter-session';
import type { WorkspaceMode } from '../state/teleprompter-state';
import type { PrimaryActionState } from '../state/teleprompter-selectors';

type DockProps = {
  mode: WorkspaceMode;
  desktopPreviewVisible: boolean;
  previewPaused: boolean;
  sessionState: SessionState;
  preparedVideoIsStale: boolean;
  action: PrimaryActionState;
  onClear(): Promise<void>;
  onResetSettings(): void;
  onOpenScript(): void;
  onOpenSettings(): void;
  onEnterStudio(): void;
  onExitStudio(): void;
  onShowPreview(): void;
  onToggleDesktopPreview(): void;
  onTogglePause(): void;
  onOpenPip(): void;
  onPrimaryAction(): void;
};

const dockButtonClass =
  'flex h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-md px-3 text-xs font-bold text-text-secondary shadow-none hover:bg-surface-inset hover:text-text-primary aria-pressed:bg-brand-coral-soft aria-pressed:text-text-primary [&_svg:not([class*=size-])]:size-[18px] max-[760px]:h-[50px] max-[760px]:flex-col max-[760px]:gap-0.5 max-[760px]:px-1 max-[760px]:text-[0.65rem]';

function DockButton({ className, ...props }: Omit<ComponentProps<typeof Button>, 'variant' | 'size'>) {
  return <Button variant="ghost" className={cn(dockButtonClass, className)} {...props} />;
}

function DockMenu({
  label,
  icon,
  children,
  className,
}: {
  label: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<DockButton className={className} aria-label={label} />}>
        {icon}<span>{label}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" sideOffset={10} align="center" className="w-56">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function PrimaryIcon({ state, stale }: { state: SessionState; stale: boolean }) {
  if (state === 'generating') return <X />;
  if (state === 'ready' && !stale) return <PictureInPicture2 />;
  if (stale) return <RefreshCcw />;
  return <Play />;
}

function primaryClass(state: SessionState, stale: boolean) {
  if (stale) return 'bg-warning-surface text-warning hover:bg-warning-surface hover:text-warning';
  if (state === 'generating') return 'bg-danger text-text-inverted hover:bg-danger hover:text-text-inverted';
  if (state === 'ready') return 'bg-positive text-text-inverted hover:bg-positive hover:text-text-inverted';
  return 'bg-brand-coral-strong text-text-inverted hover:bg-brand-coral hover:text-text-primary';
}

export function TeleprompterDock(props: DockProps) {
  const {
    mode,
    desktopPreviewVisible,
    previewPaused,
    sessionState,
    preparedVideoIsStale,
    action,
    onClear,
    onResetSettings,
    onOpenScript,
    onOpenSettings,
    onEnterStudio,
    onExitStudio,
    onShowPreview,
    onToggleDesktopPreview,
    onTogglePause,
    onOpenPip,
    onPrimaryAction,
  } = props;
  const freshVideo = sessionState === 'ready' && !preparedVideoIsStale;

  return (
    <nav
      className={cn(
        'fixed bottom-[max(10px,env(safe-area-inset-bottom))] left-1/2 z-30 flex h-[58px] w-[min(760px,calc(100%-24px))] -translate-x-1/2 items-center gap-1 rounded-xl border border-border bg-surface-elevated p-1.5 text-text-primary shadow-(--shadow-lg)',
        'max-[760px]:bottom-0 max-[760px]:h-[calc(58px+env(safe-area-inset-bottom))] max-[760px]:w-full max-[760px]:rounded-none max-[760px]:border-x-0 max-[760px]:border-b-0 max-[760px]:px-1.5 max-[760px]:pt-1 max-[760px]:pb-[calc(4px+env(safe-area-inset-bottom))]',
        mode === 'studio' && 'border-text-secondary bg-text-primary/90 text-text-inverted backdrop-blur-md',
      )}
      aria-label="Teleprompter controls"
      data-slot="app-dock"
      data-mode={mode}
    >
      {mode === 'editor' ? (
        <>
          <div className="contents max-[760px]:hidden">
            <Link href="/" className={dockButtonClass} aria-label="Frameline home">
              <FramelineMark className="size-6" size={24} /><span>Frameline</span>
            </Link>
            <DockButton onClick={onOpenScript}><FilePenLine /><span>Script</span></DockButton>
            <DockButton onClick={onOpenSettings}><SlidersHorizontal /><span>Tune</span></DockButton>
            <DockButton onClick={onEnterStudio}><Maximize2 /><span>Studio</span></DockButton>
            <DockButton aria-pressed={desktopPreviewVisible} onClick={onToggleDesktopPreview}>
              {desktopPreviewVisible ? <EyeOff /> : <Eye />}<span>{desktopPreviewVisible ? 'Hide preview' : 'Preview'}</span>
            </DockButton>
            <DockButton
              className={primaryClass(sessionState, preparedVideoIsStale)}
              data-session-state={sessionState}
              data-stale={preparedVideoIsStale || undefined}
              disabled={action.disabled}
              onClick={onPrimaryAction}
              aria-label={action.ariaLabel}
            >
              <PrimaryIcon state={sessionState} stale={preparedVideoIsStale} /><span>{action.label}</span>
            </DockButton>
          </div>

          <div className="contents min-[761px]:hidden">
            <DockMenu label="Frameline" icon={<FramelineMark className="size-5" size={20} />}>
              <DropdownMenuItem render={<Link href="/" />}><Home /> Home</DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/studio" />}><AppWindow /> Browse apps</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onResetSettings}><RefreshCcw /> Reset settings</DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={() => void onClear()}><Trash2 /> Clear script</DropdownMenuItem>
            </DockMenu>
            <DockMenu label="Edit" icon={<FilePenLine />}>
              <DropdownMenuItem onClick={onOpenScript}><FilePenLine /> Script</DropdownMenuItem>
              <DropdownMenuItem onClick={onOpenSettings}><SlidersHorizontal /> Tune</DropdownMenuItem>
            </DockMenu>
            <DockButton onClick={onEnterStudio}><Maximize2 /><span>Studio</span></DockButton>
            <DockMenu label="Preview" icon={<Eye />}>
              <DropdownMenuItem onClick={onShowPreview}><Eye /> See preview</DropdownMenuItem>
              <DropdownMenuItem disabled={!freshVideo} onClick={onOpenPip}><PictureInPicture2 /> Open PiP</DropdownMenuItem>
              <DropdownMenuSeparator />
              {freshVideo ? (
                <DropdownMenuItem disabled><Check /> Video is up to date</DropdownMenuItem>
              ) : (
                <DropdownMenuItem disabled={action.disabled} onClick={onPrimaryAction}>
                  <PrimaryIcon state={sessionState} stale={preparedVideoIsStale} />
                  {sessionState === 'generating' ? 'Cancel preparation' : action.label}
                </DropdownMenuItem>
              )}
            </DockMenu>
          </div>
        </>
      ) : (
        <>
          <Link href="/" className={cn(dockButtonClass, 'text-text-inverted hover:bg-text-secondary hover:text-text-inverted')} aria-label="Frameline home">
            <FramelineMark className="size-5" size={20} /><span className="max-[420px]:sr-only">Frameline</span>
          </Link>
          <DockButton className="text-text-inverted hover:bg-text-secondary hover:text-text-inverted" onClick={onTogglePause}>
            {previewPaused ? <Play /> : <Pause />}<span>{previewPaused ? 'Play' : 'Pause'}</span>
          </DockButton>
          <DockMenu className="text-text-inverted hover:bg-text-secondary hover:text-text-inverted" label="Edit" icon={<FilePenLine />}>
            <DropdownMenuItem onClick={onOpenScript}><FilePenLine /> Script</DropdownMenuItem>
            <DropdownMenuItem onClick={onOpenSettings}><SlidersHorizontal /> Tune</DropdownMenuItem>
          </DockMenu>
          <DockButton
            className={primaryClass(sessionState, preparedVideoIsStale)}
            data-session-state={sessionState}
            data-stale={preparedVideoIsStale || undefined}
            disabled={action.disabled}
            onClick={freshVideo ? onOpenPip : onPrimaryAction}
            aria-label={freshVideo ? 'Open floating teleprompter' : action.ariaLabel}
          >
            <PrimaryIcon state={sessionState} stale={preparedVideoIsStale} /><span>{freshVideo ? 'PiP' : action.label}</span>
          </DockButton>
          <DockButton className="text-text-inverted hover:bg-text-secondary hover:text-text-inverted" onClick={onExitStudio}>
            <X /><span>Close</span>
          </DockButton>
        </>
      )}
    </nav>
  );
}
