'use client';

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
      className={`teleprompter-root workspace app-shell ${resolvedTheme === 'dark' ? 'dark' : ''}`}
      data-theme={resolvedTheme}
    >
      <h1 className="sr-only">Frameline teleprompter</h1>
      <AppHeader
        words={derived.words}
        duration={derived.duration}
        onOpenSettings={() => dispatch({ type: 'settingsOpened' })}
        theme={theme}
        resolvedTheme={resolvedTheme}
        onToggleTheme={toggleTheme}
      />
      <CapabilityNotice unsupported={derived.unsupported} />
      <div className="app-stage" data-mobile-view={state.mobileView}>
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
        <div className="app-error" role="alert">
          {session.error}
          {session.state === 'failed' ? ' Try preparing again.' : ''}
        </div>
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
