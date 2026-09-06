"use client";

import { useEffect, useRef, type RefObject } from "react";

export type MediaSessionHandlers = {
  play(): void | Promise<void>;
  pause(): void;
  seekBy(offsetSeconds: number): void;
  seekTo(seconds: number): void;
};

export const MEDIA_SESSION_SEEK_STEP_SECONDS = 10;

/**
 * Deliberately omits `previoustrack`/`nexttrack`. The Picture-in-Picture window has three
 * control slots, and Chrome fills the outer two with track skip whenever those handlers
 * exist, which reads as restart rather than a 10 second jump. Leaving them unregistered
 * promotes `seekbackward`/`seekforward` into those slots instead.
 */
const ACTIONS: MediaSessionAction[] = ["play", "pause", "seekbackward", "seekforward", "seekto"];

function setActionHandler(session: MediaSession, action: MediaSessionAction, handler: MediaSessionActionHandler | null) {
  try {
    session.setActionHandler(action, handler);
  } catch {
    /* Browsers throw for actions they do not recognise; the remaining controls still register. */
  }
}

/**
 * Publishes the prepared video to the Media Session so Android Chrome draws
 * seek-back, play/pause, and seek-forward controls inside the Picture-in-Picture
 * window. A silent video never gets those controls on its own because the browser
 * only surfaces them for a media session.
 */
export function useMediaSessionControls(videoRef: RefObject<HTMLVideoElement | null>, enabled: boolean, handlers: MediaSessionHandlers) {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    const video = videoRef.current;
    const session = typeof navigator === "undefined" ? undefined : navigator.mediaSession;
    if (!enabled || !video || !session) return;

    setActionHandler(session, "play", () => { void handlersRef.current.play(); });
    setActionHandler(session, "pause", () => handlersRef.current.pause());
    setActionHandler(session, "seekbackward", (details) => handlersRef.current.seekBy(-(details.seekOffset ?? MEDIA_SESSION_SEEK_STEP_SECONDS)));
    setActionHandler(session, "seekforward", (details) => handlersRef.current.seekBy(details.seekOffset ?? MEDIA_SESSION_SEEK_STEP_SECONDS));
    setActionHandler(session, "seekto", (details) => { if (typeof details.seekTime === "number") handlersRef.current.seekTo(details.seekTime); });
    if (typeof MediaMetadata === "function") {
      try { session.metadata = new MediaMetadata({ title: "Teleprompter script", artist: "Frameline" }); } catch { /* Metadata is cosmetic. */ }
    }

    const publishPlaybackState = () => {
      session.playbackState = video.paused || video.ended ? "paused" : "playing";
    };
    const publishPosition = () => {
      if (typeof session.setPositionState !== "function" || !Number.isFinite(video.duration) || video.duration <= 0) return;
      try {
        session.setPositionState({
          duration: video.duration,
          playbackRate: video.playbackRate,
          position: Math.min(video.duration, Math.max(0, video.currentTime)),
        });
      } catch { /* Position state is a progressive enhancement. */ }
    };
    publishPlaybackState();
    publishPosition();
    const stateEvents = ["play", "pause", "ended"] as const;
    const positionEvents = ["timeupdate", "seeked", "ratechange", "durationchange", "loadedmetadata"] as const;
    for (const type of stateEvents) video.addEventListener(type, publishPlaybackState);
    for (const type of positionEvents) video.addEventListener(type, publishPosition);

    return () => {
      for (const type of stateEvents) video.removeEventListener(type, publishPlaybackState);
      for (const type of positionEvents) video.removeEventListener(type, publishPosition);
      for (const action of ACTIONS) setActionHandler(session, action, null);
      session.playbackState = "none";
      if (typeof session.setPositionState === "function") {
        try { session.setPositionState(); } catch { /* Clearing is best effort. */ }
      }
    };
  }, [enabled, videoRef]);
}
