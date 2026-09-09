'use client';

import { ArrowRight } from 'lucide-react';
import { cn } from 'cn';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CapabilityNotice } from './capability-notice';
import { PreparedVideo } from './prepared-video';
import { PreparationStatus } from './preparation-status';
import { PreviewPane } from './preview-pane';
import { ScriptDialog } from './script-dialog';
import { ScriptPane } from './script-pane';
import { TeleprompterDock } from './teleprompter-dock';
import { TuneDialog } from './tune-dialog';
import { useTeleprompterController } from '../hooks/use-teleprompter-controller';
import { settingChanged } from '../state/teleprompter-state';

export function TeleprompterWorkspace() {
  const { state, dispatch, session, derived, clear, primaryAction } =
    useTeleprompterController();
  const studio = state.workspaceMode === 'studio';
  const preparedOutput = (
    <PreparedVideo
      videoRef={session.videoRef}
      sessionState={session.state}
      loop={state.settings.loop}
      onPlay={session.playPrepared}
      onPause={session.pausePrepared}
      onRestart={session.restartPrepared}
      onPlaybackPositionChange={session.syncPlaybackRate}
    />
  );

  const openScript = () => dispatch({ type: 'scriptOpened' });
  const openSettings = () => dispatch({ type: 'settingsOpened' });

  return (
    <main
      className={cn(
        'relative min-h-dvh w-full text-text-primary',
        studio
          ? 'flex h-dvh flex-col overflow-hidden pb-[calc(68px+env(safe-area-inset-bottom))]'
          : 'mx-auto flex w-[min(var(--content-max),100%)] flex-col bg-canvas pb-[82px] max-[760px]:pb-[calc(66px+env(safe-area-inset-bottom))]',
      )}
      data-mode={state.workspaceMode}
      style={studio ? { backgroundColor: state.settings.backgroundColor } : undefined}
    >
      <h1 className="sr-only">Teleprompter workspace</h1>

      {studio ? (
        <PreviewPane
          mode="studio"
          text={state.text}
          settings={state.settings}
          timeline={derived.timeline}
          previewKey={derived.previewKey}
          previewPaused={state.previewPaused}
          sessionState={session.state}
          onTogglePause={() => dispatch({ type: 'previewPauseToggled' })}
          onPause={() => dispatch({ type: 'previewPauseChanged', paused: true })}
          preparedOutput={preparedOutput}
        />
      ) : (
        <>
          <div className="px-[var(--content-gutter)] max-[760px]:px-4">
            <CapabilityNotice unsupported={derived.unsupported} />
          </div>
          <div
            className={cn(
              'group/stage grid min-h-[calc(100dvh-82px)] flex-1 grid-cols-1 overflow-hidden',
              state.desktopPreviewVisible && 'min-[761px]:grid-cols-[minmax(0,1fr)_minmax(420px,0.92fr)]',
            )}
            data-slot="app-stage"
            data-mobile-view={state.mobileView}
          >
            <ScriptPane
              text={state.text}
              draftReady={state.draftReady}
              persistenceError={state.draftPersistenceError}
              onTextChange={(text) => dispatch({ type: 'textChanged', text })}
            />
            <PreviewPane
              desktopVisible={state.desktopPreviewVisible}
              text={state.text}
              settings={state.settings}
              timeline={derived.timeline}
              previewKey={derived.previewKey}
              previewPaused={state.previewPaused}
              sessionState={session.state}
              onTogglePause={() => dispatch({ type: 'previewPauseToggled' })}
              onPause={() => dispatch({ type: 'previewPauseChanged', paused: true })}
              preparedOutput={preparedOutput}
            />
          </div>
        </>
      )}

      {session.error && (
        <Alert
          variant="destructive"
          className={cn(
            'fixed left-1/2 z-20 w-[min(620px,calc(100%-24px))] -translate-x-1/2 rounded-md border-danger px-3.5 py-3 text-xs font-bold',
            studio ? 'top-3' : 'bottom-20 max-[760px]:bottom-[calc(70px+env(safe-area-inset-bottom))]',
          )}
        >
          {session.error}{session.state === 'failed' ? ' Try preparing again.' : ''}
        </Alert>
      )}

      {!studio && derived.preparedVideoIsStale && (
        <Button
          className="fixed bottom-[72px] left-1/2 z-20 h-11 w-[min(760px,calc(100%-24px))] -translate-x-1/2 justify-between rounded-lg bg-warning-surface px-4 text-warning shadow-(--shadow-md) hover:bg-accent-gold-soft max-[760px]:bottom-[calc(66px+env(safe-area-inset-bottom))] max-[760px]:w-[calc(100%-16px)]"
          onClick={primaryAction}
        >
          <span>Update the teleprompter video</span><ArrowRight />
        </Button>
      )}

      <PreparationStatus
        state={session.state}
        progress={session.progress}
        stale={derived.preparedVideoIsStale}
      />
      <TeleprompterDock
        mode={state.workspaceMode}
        desktopPreviewVisible={state.desktopPreviewVisible}
        previewPaused={state.previewPaused}
        sessionState={session.state}
        preparedVideoIsStale={derived.preparedVideoIsStale}
        action={derived.primaryAction}
        onClear={clear}
        onResetSettings={() => dispatch({ type: 'settingsReset' })}
        onOpenScript={openScript}
        onOpenSettings={openSettings}
        onEnterStudio={() => dispatch({ type: 'workspaceModeChanged', mode: 'studio' })}
        onExitStudio={() => dispatch({ type: 'workspaceModeChanged', mode: 'editor' })}
        onShowPreview={() => dispatch({ type: 'mobileViewChanged', view: 'preview' })}
        onToggleDesktopPreview={() => dispatch({ type: 'desktopPreviewToggled' })}
        onTogglePause={() => dispatch({ type: 'previewPauseToggled' })}
        onOpenPip={() => void session.enterPip()}
        onPrimaryAction={primaryAction}
      />
      <ScriptDialog
        open={state.scriptOpen}
        text={state.text}
        draftReady={state.draftReady}
        persistenceError={state.draftPersistenceError}
        onClose={() => dispatch({ type: 'scriptClosed' })}
        onClear={clear}
        onTextChange={(text) => dispatch({ type: 'textChanged', text })}
      />
      <TuneDialog
        open={state.settingsOpen}
        settings={state.settings}
        onClose={() => dispatch({ type: 'settingsClosed' })}
        onSettingChange={(key, value) => dispatch(settingChanged(key, value))}
      />
    </main>
  );
}
