import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { SessionState } from "../use-teleprompter-session";
import { usePreparedOutput } from "./use-prepared-output";

describe("usePreparedOutput", () => {
  it("commits the signature captured when preparation began", () => {
    const dispatch = vi.fn();
    const { result, rerender } = renderHook(
      ({ sessionState }: { sessionState: SessionState }) => usePreparedOutput(sessionState, dispatch),
      { initialProps: { sessionState: "idle" as SessionState } },
    );

    act(() => result.current("visual-signature"));
    rerender({ sessionState: "generating" });
    rerender({ sessionState: "ready" });

    expect(dispatch).toHaveBeenCalledWith({
      type: "preparedSignatureCommitted",
      signature: "visual-signature",
    });
  });

  it("forgets an unfinished signature after cancellation", () => {
    const dispatch = vi.fn();
    const { result, rerender } = renderHook(
      ({ sessionState }: { sessionState: SessionState }) => usePreparedOutput(sessionState, dispatch),
      { initialProps: { sessionState: "idle" as SessionState } },
    );

    act(() => result.current("abandoned-signature"));
    rerender({ sessionState: "cancelled" });
    rerender({ sessionState: "ready" });

    expect(dispatch).not.toHaveBeenCalled();
  });
});
