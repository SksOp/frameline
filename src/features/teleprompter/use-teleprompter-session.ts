"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { WorkerResponse } from "./encoding/messages";
import { DEFAULT_SETTINGS, type TeleprompterSettings } from "./types";
import { createRenderPlan, dimensionsFor, playbackRateForMediaTime, renderFont, timestampUs } from "./rendering/plan";
import { paintFrame } from "./rendering/paint-frame";

export type SessionState = "idle" | "generating" | "ready" | "failed" | "cancelled";
const FONT_LOAD_TIMEOUT_MS = 4_000;

type RenderFontSet = {
  load(font: string): Promise<unknown>;
  ready?: Promise<unknown>;
};

export async function waitForRenderFont(fonts: RenderFontSet | undefined, font: string, timeoutMs = FONT_LOAD_TIMEOUT_MS) {
  if (!fonts) return;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      Promise.all([fonts.load(font), fonts.ready ?? Promise.resolve()]),
      new Promise<never>((_, reject) => {
        timeout = setTimeout(() => reject(new Error("Render font loading timed out.")), timeoutMs);
      }),
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

export function useTeleprompterSession(wordsPerMinute = DEFAULT_SETTINGS.wordsPerMinute) {
  const workerRef = useRef<Worker | null>(null);
  const urlRef = useRef<string | null>(null);
  const idRef = useRef<string | null>(null);
  const preparedLeadInRef = useRef(0);
  const mountedRef = useRef(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<SessionState>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const syncPlaybackRate = useCallback(() => {
    const video = videoRef.current;
    if (video) video.playbackRate = playbackRateForMediaTime(video.currentTime, preparedLeadInRef.current, wordsPerMinute);
  }, [wordsPerMinute]);
  useEffect(() => { syncPlaybackRate(); }, [syncPlaybackRate]);

  const cleanupWorker = useCallback(() => { workerRef.current?.terminate(); workerRef.current = null; idRef.current = null; }, []);
  const cleanupUrl = useCallback(() => { if (urlRef.current) URL.revokeObjectURL(urlRef.current); urlRef.current = null; }, []);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      idRef.current = null;
      cleanupWorker();
      cleanupUrl();
    };
  }, [cleanupWorker, cleanupUrl]);

  const prepare = useCallback(async (text: string, settings: TeleprompterSettings) => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      try { video.currentTime = 0; } catch { /* A detached source can reject seeking. */ }
      video.removeAttribute("src");
      video.load();
    }
    cleanupWorker(); cleanupUrl(); setProgress(0); setError(""); setState("generating");
    preparedLeadInRef.current = settings.leadInSeconds;
    const id = crypto.randomUUID();
    idRef.current = id;
    try {
      try {
        await waitForRenderFont(document.fonts, renderFont(settings.fontSize));
      } catch (cause) {
        throw new Error("Render font loading failed.", { cause });
      }
      if (!mountedRef.current || idRef.current !== id) return;
      const canvas = document.createElement("canvas");
      const dimensions = dimensionsFor(settings.aspectRatio);
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      const context = canvas.getContext("2d", { alpha: false });
      if (!context) throw new Error("The drawing canvas could not be initialized.");
      context.font = renderFont(settings.fontSize);
      const plan = createRenderPlan(text, settings, context);
      const worker = new Worker(new URL("../../workers/teleprompter-encoder.worker.ts", import.meta.url), { type: "module" });
      if (!mountedRef.current || idRef.current !== id) { worker.terminate(); return; }
      workerRef.current = worker;
      worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
        const message = event.data;
        if (message.id !== idRef.current) return;
        if (message.type === "frame-request") {
          try {
            paintFrame(context, plan, message.frameIndex);
            const timestamp = timestampUs(message.frameIndex);
            const frame = new VideoFrame(canvas, { timestamp, duration: timestampUs(message.frameIndex + 1) - timestamp });
            try { worker.postMessage({ type: "frame", id, frameIndex: message.frameIndex, frame }, [frame]); }
            catch (cause) { frame.close(); throw cause; }
          } catch (cause) {
            console.error("[Frameline encoder] Could not create a video frame", cause);
            cleanupWorker();
            setError(cause instanceof Error ? cause.message : "The browser could not create a video frame.");
            setState("failed");
          }
        }
        if (message.type === "progress") setProgress((current) => Math.max(current, message.progress));
        if (message.type === "cancelled") { cleanupWorker(); setState("cancelled"); }
        if (message.type === "error") {
          console.error("[Frameline encoder] Worker reported an encoding failure", {
            code: message.code,
            message: message.message,
            name: message.details?.name,
            stack: message.details?.stack,
          });
          cleanupWorker(); setError(message.message); setState("failed");
        }
        if (message.type === "complete") {
          cleanupWorker(); const url = URL.createObjectURL(new Blob([message.buffer], { type: "video/webm" })); urlRef.current = url;
          if (videoRef.current) videoRef.current.src = url; setProgress(100); setState("ready");
        }
      };
      worker.onerror = (event) => {
        if (idRef.current !== id) return;
        console.error("[Frameline encoder] Worker crashed", {
          message: event.message,
          filename: event.filename,
          line: event.lineno,
          column: event.colno,
          error: event.error,
        });
        cleanupWorker(); setError("The background encoder stopped unexpectedly. Check the browser console for details."); setState("failed");
      };
      worker.onmessageerror = (event) => {
        if (idRef.current !== id) return;
        console.error("[Frameline encoder] Could not read a worker message", { dataType: typeof event.data });
        cleanupWorker(); setError("The browser could not read the encoder result. Check the browser console for details."); setState("failed");
      };
      worker.postMessage({ type: "encode", id, timeline: { width: plan.width, height: plan.height, frameCount: plan.frameCount, durationSeconds: plan.durationSeconds } });
    } catch (cause) {
      if (!mountedRef.current || idRef.current !== id) return;
      console.error("[Frameline encoder] Could not start video preparation", cause);
      try { cleanupWorker(); } catch { workerRef.current = null; idRef.current = null; }
      try { cleanupUrl(); } catch { urlRef.current = null; }
      const fontFailure = cause instanceof Error && /font loading/i.test(cause.message);
      setError(fontFailure ? "The teleprompter font could not be loaded. Check your connection and try again." : cause instanceof Error ? cause.message : "The browser could not start video preparation.");
      setState("failed");
    }
  }, [cleanupUrl, cleanupWorker]);

  const cancel = useCallback(() => {
    const id = idRef.current;
    if (!id) return;
    if (workerRef.current) workerRef.current.postMessage({ type: "cancel", id });
    else { idRef.current = null; setState("cancelled"); }
  }, []);
  const playPrepared = useCallback(async () => {
    if (!videoRef.current) return;
    try {
      setError("");
      syncPlaybackRate();
      await videoRef.current.play();
    } catch (cause) {
      console.error("[Frameline player] Could not play the prepared video", cause);
      setError("The prepared video could not start. Try preparing it again.");
    }
  }, [syncPlaybackRate]);
  const pausePrepared = useCallback(() => {
    videoRef.current?.pause();
  }, []);
  const restartPrepared = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      syncPlaybackRate();
    }
  }, [syncPlaybackRate]);
  const enterPip = useCallback(async () => {
    const video = videoRef.current; if (!video) return;
    try {
      setError("");
      syncPlaybackRate();
      await video.play();
      await video.requestPictureInPicture();
    } catch (cause) {
      console.error("[Frameline player] Could not enter Picture-in-Picture", cause);
      setError("The floating window could not open. Check Picture-in-Picture permissions and try again.");
    }
  }, [syncPlaybackRate]);
  return { videoRef, state, progress, error, prepare, cancel, playPrepared, pausePrepared, restartPrepared, syncPlaybackRate, enterPip };
}
