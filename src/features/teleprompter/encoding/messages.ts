import type { TeleprompterSettings } from "../types";

export type EncodeRequest = { type: "encode"; id: string; text: string; settings: TeleprompterSettings };
export type CancelRequest = { type: "cancel"; id: string };
export type WorkerRequest = EncodeRequest | CancelRequest;
export type WorkerResponse =
  | { type: "progress"; id: string; progress: number }
  | { type: "complete"; id: string; buffer: ArrayBuffer; durationSeconds: number }
  | { type: "cancelled"; id: string }
  | { type: "error"; id: string; code: string; message: string; details?: { name?: string; stack?: string } };
