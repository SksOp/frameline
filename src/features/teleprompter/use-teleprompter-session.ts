"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { WorkerResponse } from "./encoding/messages";
import type { TeleprompterSettings } from "./types";
import { playbackRate } from "./rendering/plan";

export type SessionState = "idle" | "generating" | "ready" | "failed" | "cancelled";

export function useTeleprompterSession() {
  const workerRef = useRef<Worker | null>(null);
  const urlRef = useRef<string | null>(null);
  const idRef = useRef<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<SessionState>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const cleanupWorker = useCallback(() => { workerRef.current?.terminate(); workerRef.current = null; }, []);
  const cleanupUrl = useCallback(() => { if (urlRef.current) URL.revokeObjectURL(urlRef.current); urlRef.current = null; }, []);
  useEffect(() => () => { cleanupWorker(); cleanupUrl(); }, [cleanupWorker, cleanupUrl]);

  const prepare = useCallback((text: string, settings: TeleprompterSettings) => {
    cleanupWorker(); cleanupUrl(); setProgress(0); setError(""); setState("generating");
    const id = crypto.randomUUID(); idRef.current = id;
    const worker = new Worker(new URL("../../workers/teleprompter-encoder.worker.ts", import.meta.url), { type: "module" });
    workerRef.current = worker;
    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const message = event.data;
      if (message.id !== idRef.current) return;
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
      console.error("[Frameline encoder] Could not read a worker message", { dataType: typeof event.data });
      cleanupWorker(); setError("The browser could not read the encoder result. Check the browser console for details."); setState("failed");
    };
    worker.postMessage({ type: "encode", id, text, settings });
  }, [cleanupUrl, cleanupWorker]);

  const cancel = useCallback(() => { const id = idRef.current; if (id && workerRef.current) workerRef.current.postMessage({ type: "cancel", id }); }, []);
  const enterPip = useCallback(async (wordsPerMinute: number) => {
    const video = videoRef.current; if (!video) return;
    video.playbackRate = playbackRate(wordsPerMinute);
    await video.play();
    await video.requestPictureInPicture();
  }, []);
  return { videoRef, state, progress, error, prepare, cancel, enterPip };
}
