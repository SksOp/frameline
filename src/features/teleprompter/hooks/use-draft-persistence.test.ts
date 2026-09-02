import { act, renderHook } from "@testing-library/react";
import { useReducer } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createScriptDocument } from "@/lib/scripts/document";
import { DRAFT_CLEAR_TOMBSTONE_KEY, clearStoredDraft, useDraftPersistence } from "./use-draft-persistence";
import { INITIAL_TELEPROMPTER_STATE, teleprompterReducer } from "../state/teleprompter-reducer";

const store = vi.hoisted(() => ({
  load: vi.fn(),
  save: vi.fn(),
  clear: vi.fn(),
}));

vi.mock("@/lib/client/draft-store", () => ({ draftStore: store }));

function deferred<Value>() {
  let resolve!: (value: Value) => void;
  let reject!: (cause?: unknown) => void;
  const promise = new Promise<Value>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

describe("useDraftPersistence", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    store.load.mockReset();
    store.save.mockReset();
    store.clear.mockReset();
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
    vi.useRealTimers();
  });

  it("makes the editor usable while continuing to wait for a slow stored draft", async () => {
    const load = deferred<ReturnType<typeof createScriptDocument>>();
    store.load.mockReturnValue(load.promise);
    const dispatch = vi.fn();
    renderHook(() => useDraftPersistence(dispatch, "", false, false));

    act(() => vi.advanceTimersByTime(800));
    expect(dispatch).toHaveBeenCalledWith({ type: "draftUsabilityTimedOut" });

    await act(async () => load.resolve(createScriptDocument("Stored words")));
    expect(dispatch).toHaveBeenCalledWith({ type: "draftLoaded", text: "Stored words" });
    expect(store.save).not.toHaveBeenCalled();
  });

  it("waits for hydration and retries a failed autosave without another edit", async () => {
    store.load.mockReturnValue(new Promise(() => undefined));
    store.save
      .mockRejectedValueOnce(new Error("database unavailable"))
      .mockResolvedValueOnce(undefined);
    const dispatch = vi.fn();
    const { rerender } = renderHook(
      ({ hydrated, dirty }) => useDraftPersistence(dispatch, "New words", hydrated, dirty),
      { initialProps: { hydrated: false, dirty: true } },
    );

    act(() => vi.advanceTimersByTime(500));
    expect(store.save).not.toHaveBeenCalled();

    window.localStorage.setItem(DRAFT_CLEAR_TOMBSTONE_KEY, "1");
    rerender({ hydrated: true, dirty: true });
    await act(async () => vi.advanceTimersByTime(500));
    expect(store.save).toHaveBeenCalledTimes(1);
    expect(dispatch).not.toHaveBeenCalledWith({ type: "draftSaved", text: "New words" });

    await act(async () => vi.advanceTimersByTime(1_000));
    expect(store.save).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenCalledWith({ type: "draftSaved", text: "New words" });
    expect(window.localStorage.getItem(DRAFT_CLEAR_TOMBSTONE_KEY)).toBeNull();
  });

  it("bounds autosave retries and keeps dirty state visible after exhaustion", async () => {
    store.load.mockReturnValue(new Promise(() => undefined));
    store.save.mockRejectedValue(new Error("database unavailable"));
    const dispatch = vi.fn();
    renderHook(() => useDraftPersistence(dispatch, "New words", true, true));

    await act(async () => vi.advanceTimersByTime(500));
    await act(async () => vi.advanceTimersByTime(1_000));
    await act(async () => vi.advanceTimersByTime(2_000));

    expect(store.save).toHaveBeenCalledTimes(3);
    expect(dispatch).toHaveBeenCalledWith({ type: "draftSaveFailed" });
    expect(dispatch).not.toHaveBeenCalledWith({ type: "draftSaved", text: "New words" });
  });

  it("turns a load rejection into a non-fatal hydrated state", async () => {
    const load = deferred<ReturnType<typeof createScriptDocument>>();
    store.load.mockReturnValue(load.promise);
    const dispatch = vi.fn();
    renderHook(() => useDraftPersistence(dispatch, "", false, false));

    await act(async () => load.reject(new Error("database unavailable")));
    expect(dispatch).toHaveBeenCalledWith({ type: "draftLoadFailed" });
  });

  it("leaves a durable tombstone when clear fails", async () => {
    store.clear.mockRejectedValueOnce(new Error("database unavailable"));
    await expect(clearStoredDraft()).resolves.toBe(false);
    expect(window.localStorage.getItem(DRAFT_CLEAR_TOMBSTONE_KEY)).toBe("1");
  });

  it("does not restore a slow load after the user clears", async () => {
    const load = deferred<ReturnType<typeof createScriptDocument>>();
    store.load.mockReturnValue(load.promise);
    const { result } = renderHook(() => {
      const [state, dispatch] = useReducer(teleprompterReducer, INITIAL_TELEPROMPTER_STATE);
      useDraftPersistence(dispatch, state.text, state.draftHydrated, state.draftDirty);
      return { state, dispatch };
    });

    act(() => result.current.dispatch({ type: "draftCleared" }));
    await act(async () => load.resolve(createScriptDocument("Old stored draft")));

    expect(result.current.state).toMatchObject({
      text: "",
      draftHydrated: true,
      draftLoadInvalidated: true,
    });
  });

  it("suppresses a tombstoned stored draft on the next load and retries deletion", async () => {
    window.localStorage.setItem(DRAFT_CLEAR_TOMBSTONE_KEY, "1");
    store.load.mockResolvedValue(createScriptDocument("Old stored draft"));
    store.clear.mockResolvedValue(undefined);
    const dispatch = vi.fn();
    renderHook(() => useDraftPersistence(dispatch, "", false, false));

    await act(async () => undefined);

    expect(dispatch).toHaveBeenCalledWith({ type: "draftTombstoneApplied" });
    expect(store.clear).toHaveBeenCalledTimes(1);
    expect(window.localStorage.getItem(DRAFT_CLEAR_TOMBSTONE_KEY)).toBeNull();
  });

  it("holds a new autosave behind in-flight tombstone recovery", async () => {
    const clear = deferred<void>();
    window.localStorage.setItem(DRAFT_CLEAR_TOMBSTONE_KEY, "1");
    store.load.mockResolvedValue(createScriptDocument("Old stored draft"));
    store.clear.mockReturnValue(clear.promise);
    store.save.mockResolvedValue(undefined);
    const { result } = renderHook(() => {
      const [state, dispatch] = useReducer(teleprompterReducer, INITIAL_TELEPROMPTER_STATE);
      useDraftPersistence(dispatch, state.text, state.draftHydrated, state.draftDirty);
      return { state, dispatch };
    });
    await act(async () => undefined);

    act(() => result.current.dispatch({ type: "textChanged", text: "Newer words" }));
    await act(async () => vi.advanceTimersByTime(500));
    expect(store.save).not.toHaveBeenCalled();

    await act(async () => clear.resolve());
    expect(store.save).toHaveBeenCalledTimes(1);
    expect(store.clear.mock.invocationCallOrder[0]).toBeLessThan(store.save.mock.invocationCallOrder[0]);
  });
});
