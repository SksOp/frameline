/// <reference lib="webworker" />
import { ArrayBufferTarget, Muxer } from "webm-muxer";
import type { WorkerRequest, WorkerResponse } from "@/features/teleprompter/encoding/messages";
import { createRenderPlan, FPS, timestampUs } from "@/features/teleprompter/rendering/plan";
import { visibleLineRange } from "@/features/teleprompter/rendering/layout";

const scope: DedicatedWorkerGlobalScope = self as unknown as DedicatedWorkerGlobalScope;
const cancelled = new Set<string>();

function send(message: WorkerResponse, transfer: Transferable[] = []) { scope.postMessage(message, transfer); }
function safeMessage(error: unknown) { return error instanceof Error ? error.message : "Video preparation failed."; }
function errorDetails(error: unknown) {
  return error instanceof Error ? { name: error.name, stack: error.stack } : undefined;
}

class EncodingCancelled extends Error {
  constructor() { super("Encoding cancelled"); this.name = "EncodingCancelled"; }
}

function isEncoderCreationError(error: unknown) {
  return error instanceof Error && error.name === "OperationError" && /creation|initialize|initialise/i.test(error.message);
}

async function encode(request: Extract<WorkerRequest, { type: "encode" }>) {
  const { id, text, settings } = request;
  try {
    const { width, height } = settings.aspectRatio === "16:9" ? { width: 800, height: 450 } : settings.aspectRatio === "4:3" ? { width: 720, height: 540 } : { width: 900, height: 300 };
    const canvas = new OffscreenCanvas(width, height);
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) throw new Error("The drawing canvas could not be initialized.");
    context.font = `600 ${settings.fontSize}px Inter, sans-serif`;
    const plan = createRenderPlan(text, settings, context);
    const baseConfig: VideoEncoderConfig = { codec: "vp8", width, height, framerate: FPS, bitrate: 1_500_000, latencyMode: "realtime" };

    const runAttempt = async (config: VideoEncoderConfig) => {
      const support = await VideoEncoder.isConfigSupported(config);
      if (!support.supported) throw new DOMException("This VP8 encoder configuration is not supported.", "NotSupportedError");

      const target = new ArrayBufferTarget();
      const muxer = new Muxer({ target, video: { codec: "V_VP8", width, height, frameRate: FPS } });
      let attemptError: DOMException | null = null;
      const attemptEncoder = new VideoEncoder({
        output: (chunk, metadata) => muxer.addVideoChunk(chunk, metadata),
        error: (error) => { attemptError = error; },
      });

      try {
        attemptEncoder.configure(config);
        let lastProgress = -1;
        for (let frameIndex = 0; frameIndex < plan.frameCount; frameIndex++) {
          if (frameIndex % 8 === 0) await new Promise((resolve) => setTimeout(resolve, 0));
          if (attemptError) throw attemptError;
          if (cancelled.has(id)) throw new EncodingCancelled();
          while (attemptEncoder.encodeQueueSize > 8) {
            await new Promise((resolve) => setTimeout(resolve, 8));
            if (attemptError) throw attemptError;
            if (cancelled.has(id)) throw new EncodingCancelled();
          }
          context.fillStyle = settings.backgroundColor;
          context.fillRect(0, 0, width, height);
          const activeFrame = Math.max(0, frameIndex - plan.leadInFrames);
          const activeFrames = Math.max(1, plan.frameCount - plan.leadInFrames - 1);
          const scroll = (activeFrame / activeFrames) * plan.travel;
          const top = height * 0.5 - scroll;
          const range = visibleLineRange(scroll, height, plan.lineHeightPx, plan.lines.length);
          context.fillStyle = settings.textColor;
          context.textAlign = settings.alignment;
          context.textBaseline = "middle";
          for (let lineIndex = range.first; lineIndex <= range.last; lineIndex++) {
            const x = settings.alignment === "center" ? width / 2 : settings.horizontalPadding;
            const y = top + lineIndex * plan.lineHeightPx;
            context.fillText(plan.lines[lineIndex] ?? "", x, y, width - settings.horizontalPadding * 2);
          }
          if (settings.showGuide) {
            context.fillStyle = "#d5a94e";
            context.fillRect(18, height / 2 - 1, 24, 2);
            context.fillRect(width - 42, height / 2 - 1, 24, 2);
          }
          const timestamp = timestampUs(frameIndex);
          const frame = new VideoFrame(canvas, { timestamp, duration: timestampUs(frameIndex + 1) - timestamp });
          attemptEncoder.encode(frame, { keyFrame: frameIndex % (FPS * 4) === 0 });
          frame.close();
          const progress = Math.floor(((frameIndex + 1) / plan.frameCount) * 100);
          if (progress >= lastProgress + 2) { lastProgress = progress; send({ type: "progress", id, progress }); }
        }
        await attemptEncoder.flush();
        if (attemptError) throw attemptError;
        muxer.finalize();
        return target.buffer;
      } finally {
        try { if (attemptEncoder.state !== "closed") attemptEncoder.close(); } catch {}
      }
    };

    let buffer: ArrayBuffer;
    try {
      buffer = await runAttempt({ ...baseConfig, hardwareAcceleration: "prefer-hardware" });
    } catch (hardwareError) {
      if (!isEncoderCreationError(hardwareError)) throw hardwareError;
      try {
        buffer = await runAttempt(baseConfig);
      } catch (fallbackError) {
        const hardwareMessage = safeMessage(hardwareError);
        const fallbackMessage = safeMessage(fallbackError);
        throw new DOMException(`Encoder creation failed with hardware preference (${hardwareMessage}) and browser default (${fallbackMessage}).`, "OperationError");
      }
    }
    send({ type: "complete", id, buffer, durationSeconds: plan.durationSeconds }, [buffer]);
  } catch (error) {
    if (error instanceof EncodingCancelled) { send({ type: "cancelled", id }); return; }
    send({ type: "error", id, code: "encoding_failed", message: safeMessage(error), details: errorDetails(error) });
  } finally { cancelled.delete(id); }
}

scope.onmessage = (event: MessageEvent<WorkerRequest>) => {
  if (event.data.type === "cancel") cancelled.add(event.data.id);
  else void encode(event.data);
};
