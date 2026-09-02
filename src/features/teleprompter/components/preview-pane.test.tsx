import { fireEvent, render, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createScriptTimeline, buildRenderPlan } from "../rendering/plan";
import { DEFAULT_SETTINGS } from "../types";
import { PreviewPane } from "./preview-pane";

const measure = { measureText: (text: string) => ({ width: text.length * 10 }), font: "" } as unknown as CanvasRenderingContext2D;

describe("PreviewPane", () => {
  afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

  it("renders the canonical canvas line plan and scales its geometry across aspect ratios", async () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(measure);
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ width: 450, height: 150, x: 0, y: 0, top: 0, right: 450, bottom: 150, left: 0, toJSON: () => ({}) });
    vi.stubGlobal("ResizeObserver", class {
      constructor(private callback: ResizeObserverCallback) {}
      observe() { this.callback([{ contentRect: { width: 450 } } as ResizeObserverEntry], this as unknown as ResizeObserver); }
      disconnect() {}
      unobserve() {}
    });
    const text = `${Array.from({ length: 30 }, () => "word").join(" ")}\n\nLast paragraph 👋🏽`;
    const settings = { ...DEFAULT_SETTINGS, aspectRatio: "3:1" as const };
    const view = render(<PreviewPane text={text} settings={settings} timeline={createScriptTimeline(text, settings)} previewKey="first" previewPaused={false} sessionState="idle" onTogglePause={() => undefined} />);
    const expected = buildRenderPlan(text, settings, measure);

    await waitFor(() => expect(view.container.querySelectorAll(".preview-line")).toHaveLength(expected.lines.length));
    expect(Array.from(view.container.querySelectorAll(".preview-line"), (line) => line.textContent === "\u00a0" ? "" : line.textContent)).toEqual(expected.lines);
    const preview = view.container.querySelector<HTMLElement>(".preview")!;
    const viewport = view.container.querySelector<HTMLElement>(".preview-viewport")!;
    expect(viewport.dataset.canonicalWidth).toBe("900");
    expect(preview.style.getPropertyValue("--preview-scale")).toBe("0.5");
    expect(preview.style.getPropertyValue("--preview-padding")).toBe("28px");
    expect(preview.style.getPropertyValue("--preview-start-y")).toBe("150px");

    const classic = { ...settings, aspectRatio: "4:3" as const };
    view.rerender(<PreviewPane text={text} settings={classic} timeline={createScriptTimeline(text, classic)} previewKey="classic" previewPaused={false} sessionState="idle" onTogglePause={() => undefined} />);
    await waitFor(() => expect(viewport.dataset.canonicalWidth).toBe("720"));
    expect(Number(preview.style.getPropertyValue("--preview-scale"))).toBeCloseTo(0.625);
    expect(preview.style.getPropertyValue("--preview-start-y")).toBe("337.5px");
  });

  it("remounts script and progress together for restart and content changes", async () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(measure);
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ width: 450, height: 150, x: 0, y: 0, top: 0, right: 450, bottom: 150, left: 0, toJSON: () => ({}) });
    vi.stubGlobal("ResizeObserver", class {
      constructor(private callback: ResizeObserverCallback) {}
      observe() { this.callback([{ contentRect: { width: 450, height: 150 } } as ResizeObserverEntry], this as unknown as ResizeObserver); }
      disconnect() {}
      unobserve() {}
    });
    const settings = { ...DEFAULT_SETTINGS, showProgress: true };
    const view = render(<PreviewPane text="First script" settings={settings} timeline={createScriptTimeline("First script", settings)} previewKey="first" previewPaused={false} sessionState="idle" onTogglePause={() => undefined} />);
    await waitFor(() => expect(view.container.querySelector(".preview-script")).not.toBeNull());
    const firstScript = view.container.querySelector(".preview-script");
    const firstProgress = view.container.querySelector(".reading-progress-track");
    expect(firstProgress?.parentElement?.classList.contains("preview")).toBe(true);
    expect(firstScript?.getAttribute("data-animation-key")).toBe(firstProgress?.getAttribute("data-animation-key"));
    expect((firstScript as HTMLElement).style.fontFamily).toBe('"Inter Variable", sans-serif');
    expect((firstScript as HTMLElement).style.fontWeight).toBe("600");

    fireEvent.click(within(view.container).getByRole("button", { name: "Restart preview" }));
    const restartedScript = view.container.querySelector(".preview-script");
    const restartedProgress = view.container.querySelector(".reading-progress-track");
    expect(restartedScript).not.toBe(firstScript);
    expect(restartedProgress).not.toBe(firstProgress);
    expect(restartedScript?.getAttribute("data-animation-key")).toBe(restartedProgress?.getAttribute("data-animation-key"));

    view.rerender(<PreviewPane text="Changed script" settings={settings} timeline={createScriptTimeline("Changed script", settings)} previewKey="changed" previewPaused={false} sessionState="idle" onTogglePause={() => undefined} />);
    expect(view.container.querySelector(".preview-script")).not.toBe(restartedScript);
    expect(view.container.querySelector(".reading-progress-track")).not.toBe(restartedProgress);
  });
});
