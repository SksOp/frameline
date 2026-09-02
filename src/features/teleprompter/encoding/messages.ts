export interface EncodeTimeline {
  width: number;
  height: number;
  frameCount: number;
  durationSeconds: number;
}

export type EncodeRequest = { type: "encode"; id: string; timeline: EncodeTimeline };
export type FrameRequest = { type: "frame"; id: string; frameIndex: number; frame: VideoFrame };
export type CancelRequest = { type: "cancel"; id: string };
export type WorkerRequest = EncodeRequest | FrameRequest | CancelRequest;
export type WorkerResponse =
  | { type: "frame-request"; id: string; frameIndex: number }
  | { type: "progress"; id: string; progress: number }
  | { type: "complete"; id: string; buffer: ArrayBuffer; durationSeconds: number }
  | { type: "cancelled"; id: string }
  | { type: "error"; id: string; code: string; message: string; details?: { name?: string; stack?: string } };
