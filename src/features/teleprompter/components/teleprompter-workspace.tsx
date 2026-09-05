'use client';

import { cn } from 'cn';
import { Alert } from '@/components/ui/alert';
import { AppHeader } from './app-header';
import { CapabilityNotice } from './capability-notice';
import { PreparedVideo } from './prepared-video';
import { PreparationStatus } from './preparation-status';
import { PreviewPane } from './preview-pane';
import { ScriptPane } from './script-pane';
import { TeleprompterDock } from './teleprompter-dock';
import { TuneDialog } from './tune-dialog';
import { useTeleprompterController } from '../hooks/use-teleprompter-controller';
import { useTheme } from '../hooks/use-theme';
import { settingChanged } from '../state/teleprompter-state';

export function TeleprompterWorkspace() {
  const { state, dispatch, session, derived, clear, primaryAction } =
    useTeleprompterController();
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  return (
    <main
      className={cn(
        'mx-auto min-h-dvh w-[min(1380px,100%)] px-[30px] pb-28 max-[760px]:w-full max-[760px]:px-[14px] max-[760px]:pb-[calc(92px+env(safe-area-inset-bottom))]',
        resolvedTheme === 'dark' && 'dark',
      )}
      data-theme={resolvedTheme}
    >
      <h1 className="sr-only">Teleprompter workspace</h1>
      <AppHeader
        words={derived.words}
        duration={derived.duration}
        onOpenSettings={() => dispatch({ type: 'settingsOpened' })}
        theme={theme}
        resolvedTheme={resolvedTheme}
        onToggleTheme={toggleTheme}
      />
      <CapabilityNotice unsupported={derived.unsupported} />
      <div
        className="group/stage mt-[22px] grid min-h-[calc(100dvh-182px)] grid-cols-[minmax(0,1.04fr)_minmax(420px,0.96fr)] overflow-hidden rounded-xl border border-border bg-surface shadow-(--shadow-md) max-[760px]:mt-[17px] max-[760px]:block max-[760px]:min-h-0 max-[760px]:rounded-none max-[760px]:border-0 max-[760px]:bg-transparent max-[760px]:shadow-none"
        data-slot="app-stage"
        data-mobile-view={state.mobileView}
      >
        <ScriptPane
          text={state.text}
          draftReady={state.draftReady}
          persistenceError={state.draftPersistenceError}
          words={derived.words}
          duration={derived.duration}
          onClear={clear}
          onTextChange={(text) => dispatch({ type: 'textChanged', text })}
        />
        <PreviewPane
          text={state.text}
          settings={state.settings}
          timeline={derived.timeline}
          previewKey={derived.previewKey}
          previewPaused={state.previewPaused}
          sessionState={session.state}
          onTogglePause={() => dispatch({ type: 'previewPauseToggled' })}
          preparedOutput={
            <PreparedVideo
              videoRef={session.videoRef}
              sessionState={session.state}
              loop={state.settings.loop}
              onPlay={session.playPrepared}
              onPause={session.pausePrepared}
              onRestart={session.restartPrepared}
              onPlaybackPositionChange={session.syncPlaybackRate}
            />
          }
        />
      </div>
      {session.error && (
        <Alert
          variant="destructive"
          className="mx-auto mt-4 w-[min(620px,100%)] rounded-md border-danger px-3.5 py-3 text-xs font-bold max-[760px]:mt-2"
        >
          {session.error}
          {session.state === 'failed' ? ' Try preparing again.' : ''}
        </Alert>
      )}
      <PreparationStatus
        state={session.state}
        progress={session.progress}
        stale={derived.preparedVideoIsStale}
      />
      <TeleprompterDock
        mobileView={state.mobileView}
        sessionState={session.state}
        preparedVideoIsStale={derived.preparedVideoIsStale}
        action={derived.primaryAction}
        onMobileViewChange={(view) =>
          dispatch({ type: 'mobileViewChanged', view })
        }
        onOpenSettings={() => dispatch({ type: 'settingsOpened' })}
        onPrimaryAction={primaryAction}
      />
      <TuneDialog
        open={state.settingsOpen}
        settings={state.settings}
        onClose={() => dispatch({ type: 'settingsClosed' })}
        onSettingChange={(key, value) => dispatch(settingChanged(key, value))}
        theme={theme}
        onThemeChange={setTheme}
      />
    </main>
  );
}
