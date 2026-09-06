'use client';

import { useEffect, useRef, type RefObject } from 'react';

export type MediaSessionHandlers = {
  play(): void | Promise<void>;
  pause(): void;
  seekBy(offsetSeconds: number): void;
  seekTo(seconds: number): void;
};

export const MEDIA_SESSION_SEEK_STEP_SECONDS = 10;

// Added previoustrack and nexttrack to force the PiP physical buttons to render
const ACTIONS: MediaSessionAction[] = [
  'play',
  'pause',
  'seekbackward',
  'seekforward',
  'seekto',
  'previoustrack',
  'nexttrack',
];

function setActionHandler(
  session: MediaSession,
  action: MediaSessionAction,
  handler: MediaSessionActionHandler | null,
) {
  try {
    session.setActionHandler(action, handler);
  } catch {
    /* Browsers throw for actions they do not recognise; the remaining controls still register. */
  }
}

export function useMediaSessionControls(
  videoRef: RefObject<HTMLVideoElement | null>,
  enabled: boolean,
  handlers: MediaSessionHandlers,
  explicitDuration: number, // Added explicit duration parameter
) {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    const video = videoRef.current;
    const session =
      typeof navigator === 'undefined' ? undefined : navigator.mediaSession;
    if (!enabled || !video || !session) return;

    setActionHandler(session, 'play', () => {
      void handlersRef.current.play();
    });
    setActionHandler(session, 'pause', () => handlersRef.current.pause());

    // Standard seek controls
    setActionHandler(session, 'seekbackward', (details) =>
      handlersRef.current.seekBy(
        -(details.seekOffset ?? MEDIA_SESSION_SEEK_STEP_SECONDS),
      ),
    );
    setActionHandler(session, 'seekforward', (details) =>
      handlersRef.current.seekBy(
        details.seekOffset ?? MEDIA_SESSION_SEEK_STEP_SECONDS,
      ),
    );
    setActionHandler(session, 'seekto', (details) => {
      if (typeof details.seekTime === 'number')
        handlersRef.current.seekTo(details.seekTime);
    });

    // PiP fallback controls (Maps the track skip buttons to seek)
    setActionHandler(session, 'previoustrack', () =>
      handlersRef.current.seekBy(-MEDIA_SESSION_SEEK_STEP_SECONDS),
    );
    setActionHandler(session, 'nexttrack', () =>
      handlersRef.current.seekBy(MEDIA_SESSION_SEEK_STEP_SECONDS),
    );

    if (typeof MediaMetadata === 'function') {
      try {
        session.metadata = new MediaMetadata({
          title: 'Teleprompter script',
          artist: 'Frameline',
        });
      } catch {
        /* Metadata is cosmetic. */
      }
    }

    const publishPlaybackState = () => {
      session.playbackState =
        video.paused || video.ended ? 'paused' : 'playing';
    };

    const publishPosition = () => {
      // Use explicit duration if the video element reports Infinity or NaN (common with Blob WebMs)
      const activeDuration =
        Number.isFinite(video.duration) && video.duration > 0
          ? video.duration
          : explicitDuration;

      if (
        typeof session.setPositionState !== 'function' ||
        !activeDuration ||
        activeDuration <= 0
      )
        return;
      try {
        session.setPositionState({
          duration: activeDuration,
          playbackRate: video.playbackRate,
          position: Math.min(activeDuration, Math.max(0, video.currentTime)),
        });
      } catch {
        /* Position state is a progressive enhancement. */
      }
    };

    publishPlaybackState();
    publishPosition();

    const stateEvents = ['play', 'pause', 'ended'] as const;
    const positionEvents = [
      'timeupdate',
      'seeked',
      'ratechange',
      'durationchange',
      'loadedmetadata',
    ] as const;

    for (const type of stateEvents)
      video.addEventListener(type, publishPlaybackState);
    for (const type of positionEvents)
      video.addEventListener(type, publishPosition);

    return () => {
      for (const type of stateEvents)
        video.removeEventListener(type, publishPlaybackState);
      for (const type of positionEvents)
        video.removeEventListener(type, publishPosition);
      for (const action of ACTIONS) setActionHandler(session, action, null);
      session.playbackState = 'none';
      if (typeof session.setPositionState === 'function') {
        try {
          session.setPositionState();
        } catch {
          /* Clearing is best effort. */
        }
      }
    };
  }, [enabled, videoRef, explicitDuration]); // Added explicitDuration to dependency array
}
