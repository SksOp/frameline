import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_SETTINGS } from "./types";
import { renderFont } from "./rendering/plan";
import { useTeleprompterSession, waitForRenderFont } from "./use-teleprompter-session";

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (cause?: unknown) => void;
  const promise = new Promise<T>((onResolve, onReject) => { resolve = onResolve; reject = onReject; });
  return { promise, resolve, reject };
}

function installFonts(load: (font: string) => Promise<unknown>, ready: Promise<unknown> = Promise.resolve()) {
  Object.defineProperty(document, "fonts", { configurable: true, value: { load, ready } });
}

function installCanvas() {
  const context = { measureText: (text: string) => ({ width: text.length * 10 }), font: "" } as unknown as CanvasRenderingContext2D;
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(context);
  return context;
}

function installWorker() {
  const constructed = vi.fn();
  const posted = vi.fn();
  const terminated = vi.fn();
  vi.stubGlobal("Worker", class {
    onmessage: ((event: MessageEvent) => void) | null = null;
    onerror: ((event: ErrorEvent) => void) | null = null;
    onmessageerror: ((event: MessageEvent) => void) | null = null;
    constructor() { constructed(); }
    postMessage = posted;
    terminate = terminated;
  });
  return { constructed, posted, terminated };
}

describe("useTeleprompterSession", () => {
  afterEach(() => {
    Object.defineProperty(document, "fonts", { configurable: true, value: undefined });
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("turns synchronous worker setup failures into a cleaned failed state", async () => {
    installCanvas();
    vi.stubGlobal("Worker", class {
      constructor() { throw new Error("worker unavailable"); }
    });
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const { result } = renderHook(() => useTeleprompterSession());
    const video = document.createElement("video");
    video.src = "blob:prepared";
    video.currentTime = 4;
    const pause = vi.spyOn(video, "pause").mockImplementation(() => undefined);
    const load = vi.spyOn(video, "load").mockImplementation(() => undefined);
    (result.current.videoRef as { current: HTMLVideoElement | null }).current = video;

    await act(async () => result.current.prepare("Test words", DEFAULT_SETTINGS));

    expect(pause).toHaveBeenCalledOnce();
    expect(load).toHaveBeenCalledOnce();
    expect(video.currentTime).toBe(0);
    expect(video.hasAttribute("src")).toBe(false);
    expect(result.current.state).toBe("failed");
    expect(result.current.error).toBe("worker unavailable");
  });

  it("waits for the exact render font before measuring and starting the worker", async () => {
    const fontLoad = deferred<unknown>();
    const load = vi.fn(() => fontLoad.promise);
    installFonts(load);
    const context = installCanvas();
    const worker = installWorker();
    const { result } = renderHook(() => useTeleprompterSession());
    let request!: Promise<void>;

    act(() => { request = result.current.prepare("Measured only when ready", DEFAULT_SETTINGS); });
    expect(result.current.state).toBe("generating");
    expect(load).toHaveBeenCalledWith(renderFont(DEFAULT_SETTINGS.fontSize));
    expect(context.font).toBe("");
    expect(worker.constructed).not.toHaveBeenCalled();

    fontLoad.resolve([]);
    await act(async () => request);
    expect(context.font).toBe(renderFont(DEFAULT_SETTINGS.fontSize));
    expect(worker.constructed).toHaveBeenCalledOnce();
    expect(worker.posted).toHaveBeenCalledWith(expect.objectContaining({ type: "encode" }));
  });

  it("does not start a worker when preparation is cancelled during font loading", async () => {
    const fontLoad = deferred<unknown>();
    installFonts(() => fontLoad.promise);
    installCanvas();
    const worker = installWorker();
    const { result } = renderHook(() => useTeleprompterSession());
    let request!: Promise<void>;
    act(() => { request = result.current.prepare("Cancelled", DEFAULT_SETTINGS); });
    act(() => result.current.cancel());
    expect(result.current.state).toBe("cancelled");
    fontLoad.resolve([]);
    await act(async () => request);
    expect(worker.constructed).not.toHaveBeenCalled();
  });

  it("only starts the newest request when font waits are superseded", async () => {
    const first = deferred<unknown>();
    const second = deferred<unknown>();
    const load = vi.fn().mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
    installFonts(load);
    installCanvas();
    const worker = installWorker();
    const { result } = renderHook(() => useTeleprompterSession());
    let firstRequest!: Promise<void>;
    let secondRequest!: Promise<void>;
    act(() => { firstRequest = result.current.prepare("Old", DEFAULT_SETTINGS); });
    act(() => { secondRequest = result.current.prepare("New", DEFAULT_SETTINGS); });

    first.resolve([]);
    await act(async () => firstRequest);
    expect(worker.constructed).not.toHaveBeenCalled();
    second.resolve([]);
    await act(async () => secondRequest);
    expect(worker.constructed).toHaveBeenCalledOnce();
  });

  it("does not start a stale worker after unmount", async () => {
    const fontLoad = deferred<unknown>();
    installFonts(() => fontLoad.promise);
    installCanvas();
    const worker = installWorker();
    const { result, unmount } = renderHook(() => useTeleprompterSession());
    let request!: Promise<void>;
    act(() => { request = result.current.prepare("Unmounted", DEFAULT_SETTINGS); });
    unmount();
    fontLoad.resolve([]);
    await request;
    expect(worker.constructed).not.toHaveBeenCalled();
  });

  it("reports font rejection recoverably and allows a retry", async () => {
    const load = vi.fn().mockRejectedValueOnce(new Error("font network failure")).mockResolvedValueOnce([]);
    installFonts(load);
    installCanvas();
    const worker = installWorker();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const { result } = renderHook(() => useTeleprompterSession());

    await act(async () => result.current.prepare("Retryable", DEFAULT_SETTINGS));
    expect(result.current.state).toBe("failed");
    expect(result.current.error).toMatch(/font could not be loaded/i);
    expect(worker.constructed).not.toHaveBeenCalled();

    await act(async () => result.current.prepare("Retryable", DEFAULT_SETTINGS));
    expect(result.current.state).toBe("generating");
    expect(worker.constructed).toHaveBeenCalledOnce();
  });

  it("bounds a stalled render-font load", async () => {
    vi.useFakeTimers();
    const stalled = new Promise<never>(() => undefined);
    const wait = waitForRenderFont({ load: () => stalled, ready: Promise.resolve() }, renderFont(42), 25);
    const rejection = expect(wait).rejects.toThrow(/timed out/i);
    await vi.advanceTimersByTimeAsync(25);
    await rejection;
  });

  it("reports Picture-in-Picture rejection without discarding the session", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const { result } = renderHook(() => useTeleprompterSession());
    const video = document.createElement("video");
    vi.spyOn(video, "play").mockRejectedValue(new Error("permission denied"));
    (result.current.videoRef as { current: HTMLVideoElement | null }).current = video;

    await act(async () => result.current.enterPip());

    expect(result.current.state).toBe("idle");
    expect(result.current.error).toMatch(/floating window could not open/i);
  });

  it("owns prepared video playback and restart operations", async () => {
    const { result, rerender } = renderHook(
      ({ wordsPerMinute }) => useTeleprompterSession(wordsPerMinute),
      { initialProps: { wordsPerMinute: 120 } },
    );
    const video = document.createElement("video");
    const play = vi.spyOn(video, "play").mockResolvedValue();
    const pause = vi.spyOn(video, "pause").mockImplementation(() => undefined);
    (result.current.videoRef as { current: HTMLVideoElement | null }).current = video;

    await act(async () => result.current.playPrepared());
    expect(video.playbackRate).toBe(0.8);
    Object.defineProperty(video, "paused", { configurable: true, value: false });
    rerender({ wordsPerMinute: 180 });
    expect(video.playbackRate).toBe(1.2);
    act(() => result.current.pausePrepared());
    video.currentTime = 3;
    act(() => result.current.restartPrepared());

    expect(play).toHaveBeenCalledOnce();
    expect(pause).toHaveBeenCalledOnce();
    expect(video.currentTime).toBe(0);
  });
});
