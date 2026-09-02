/// <reference lib="webworker" />
import { ArrayBufferTarget, Muxer } from "webm-muxer";
import type { WorkerRequest, WorkerResponse } from "@/features/teleprompter/encoding/messages";
import { FPS } from "@/features/teleprompter/rendering/plan";

const scope: DedicatedWorkerGlobalScope = self as unknown as DedicatedWorkerGlobalScope;
const cancelled = new Set<string>();
let pendingFrame: { id: string; frameIndex: number; resolve(frame: VideoFrame | null): void } | null = null;

function send(message: WorkerResponse, transfer: Transferable[] = []) { scope.postMessage(message, transfer); }
function safeMessage(error: unknown) { return error instanceof Error ? error.message : "Video preparation failed."; }
function errorDetails(error: unknown) { return error instanceof Error ? { name: error.name, stack: error.stack } : undefined; }

class EncodingCancelled extends Error {
  constructor() { super("Encoding cancelled"); this.name = "EncodingCancelled"; }
}

function nextFrame(id: string, frameIndex: number) {
  return new Promise<VideoFrame | null>((resolve) => {
    pendingFrame = { id, frameIndex, resolve };
    send({ type: "frame-request", id, frameIndex });
  });
}

async function encode(request: Extract<WorkerRequest, { type: "encode" }>) {
  const { id, timeline } = request;
  const { width, height, frameCount, durationSeconds } = timeline;
  let encoderError: DOMException | null = null;
  let encoder: VideoEncoder | null = null;
  try {
    const config: VideoEncoderConfig = { codec: "vp8", width, height, framerate: FPS, bitrate: 650_000 };
    const support = await VideoEncoder.isConfigSupported(config);
    if (!support.supported) throw new DOMException("This VP8 encoder configuration is not supported.", "NotSupportedError");

    const target = new ArrayBufferTarget();
    const muxer = new Muxer({
      target,
      video: { codec: "V_VP8", width, height, frameRate: FPS },
      firstTimestampBehavior: "offset",
    });
    encoder = new VideoEncoder({
      output: (chunk, metadata) => muxer.addVideoChunk(chunk, metadata),
      error: (error) => { encoderError = error; },
    });
    encoder.configure(config);

    let lastProgress = -1;
    for (let frameIndex = 0; frameIndex < frameCount; frameIndex++) {
      if (encoderError) throw encoderError;
      if (cancelled.has(id)) throw new EncodingCancelled();
      while (encoder.encodeQueueSize > 8) {
        await new Promise((resolve) => setTimeout(resolve, 8));
        if (encoderError) throw encoderError;
        if (cancelled.has(id)) throw new EncodingCancelled();
      }

      const frame = await nextFrame(id, frameIndex);
      pendingFrame = null;
      if (!frame || cancelled.has(id)) {
        frame?.close();
        throw new EncodingCancelled();
      }
      try {
        encoder.encode(frame, { keyFrame: frameIndex % (FPS * 5) === 0 });
      } finally {
        frame.close();
      }
      const progress = Math.floor(((frameIndex + 1) / frameCount) * 100);
      if (progress >= lastProgress + 2) { lastProgress = progress; send({ type: "progress", id, progress }); }
    }

    await encoder.flush();
    if (encoderError) throw encoderError;
    muxer.finalize();
    const buffer = target.buffer;
    send({ type: "complete", id, buffer, durationSeconds }, [buffer]);
  } catch (error) {
    if (error instanceof EncodingCancelled) send({ type: "cancelled", id });
    else send({ type: "error", id, code: "encoding_failed", message: safeMessage(error), details: errorDetails(error) });
  } finally {
    pendingFrame = null;
    try { if (encoder?.state !== "closed") encoder?.close(); } catch {}
    cancelled.delete(id);
  }
}

scope.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const message = event.data;
  if (message.type === "cancel") {
    cancelled.add(message.id);
    if (pendingFrame?.id === message.id) pendingFrame.resolve(null);
    return;
  }
  if (message.type === "frame") {
    if (pendingFrame?.id === message.id && pendingFrame.frameIndex === message.frameIndex) pendingFrame.resolve(message.frame);
    else message.frame.close();
    return;
  }
  void encode(message);
};
