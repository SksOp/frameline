import { describe, expect, it, vi } from "vitest";
import { wrapText, visibleLineRange } from "./layout";
import { createRenderPlan, createScriptTimeline, horizontalPaddingPercent, playbackRate, playbackRateForMediaTime, renderFont, timestampUs } from "./plan";
import { DEFAULT_SETTINGS } from "../types";
import { paintFrame, visibleLineRangeAtTop } from "./paint-frame";

const measure = { measureText: (text: string) => ({ width: text.length * 10 }) };
describe("rendering", () => {
  it("uses the compact reading defaults", () => expect(DEFAULT_SETTINGS).toMatchObject({ wordsPerMinute: 120, fontSize: 42, lineHeight: 1.5, leadInSeconds: 0, showProgress: true }));
  it("wraps deterministically and preserves paragraphs", () => expect(wrapText("one two\n\nthree", 45, measure)).toEqual(["one", "two", "", "three"]));
  it("safely wraps, plans, and paints an empty script", () => {
    expect(wrapText("", 100, measure)).toEqual([""]);
    const context = { ...measure, fillRect: vi.fn(), fillText: vi.fn(), fillStyle: "", font: "", textAlign: "center", textBaseline: "middle" } as unknown as CanvasRenderingContext2D;
    const plan = createRenderPlan("", DEFAULT_SETTINGS, context);
    expect(plan.lines).toEqual([""]);
    expect(plan.contentHeight).toBe(plan.lineHeightPx);
    expect(() => paintFrame(context, plan, 0)).not.toThrow();
    expect(context.font).toBe(renderFont(DEFAULT_SETTINGS.fontSize));
  });
  it("selects bounded visible lines", () => expect(visibleLineRange(50, 100, 25, 20)).toEqual({ first: 1, last: 7 }));
  it("selects lines visible from the concept-style first-line position", () => {
    expect(visibleLineRangeAtTop(125, 100, 25, 20)).toEqual({ first: 0, last: 0 });
    expect(visibleLineRangeAtTop(-50, 100, 25, 20)).toEqual({ first: 1, last: 7 });
  });
  it("builds stable timing", () => {
    const plan = createRenderPlan("one two three", DEFAULT_SETTINGS, measure);
    expect(plan.frameCount).toBe(Math.ceil(plan.durationSeconds * 30));
    expect(timestampUs(30)).toBe(1_000_000);
    expect(playbackRate(300)).toBe(2);
  });
  it("keeps lead-in wall time fixed while speed changes only content playback", () => {
    const text = Array.from({ length: 150 }, () => "word").join(" ");
    const slow = createScriptTimeline(text, { leadInSeconds: 2, wordsPerMinute: 75 });
    const fast = createScriptTimeline(text, { leadInSeconds: 2, wordsPerMinute: 300 });
    expect(slow.encodedDurationSeconds).toBe(62);
    expect(fast.encodedDurationSeconds).toBe(62);
    expect(slow.wallClockDurationSeconds).toBe(122);
    expect(fast.wallClockDurationSeconds).toBe(32);
    expect(playbackRateForMediaTime(1.99, 2, 300)).toBe(1);
    expect(playbackRateForMediaTime(2, 2, 300)).toBe(2);
  });
  it("scales preview padding from the same canvas dimensions used for generation", () => {
    expect(horizontalPaddingPercent({ aspectRatio: "3:1", horizontalPadding: 56 })).toBeCloseTo(56 / 900 * 100);
    expect(horizontalPaddingPercent({ aspectRatio: "16:9", horizontalPadding: 56 })).toBeCloseTo(7);
    expect(horizontalPaddingPercent({ aspectRatio: "4:3", horizontalPadding: 72 })).toBeCloseTo(10);
  });
  it("paints the progress track into generated frames when enabled", () => {
    const context = { ...measure, fillRect: vi.fn(), fillText: vi.fn(), fillStyle: "", font: "", textAlign: "center", textBaseline: "middle" } as unknown as CanvasRenderingContext2D;
    const plan = createRenderPlan("one two three", DEFAULT_SETTINGS, context);
    paintFrame(context, plan, plan.frameCount - 1);
    const progressCalls = vi.mocked(context.fillRect).mock.calls.filter(([, y, , height]) => y === plan.height - 4 && height === 4);
    expect(progressCalls).toEqual([[0, plan.height - 4, plan.width, 4], [0, plan.height - 4, plan.width, 4]]);
  });
  it("omits generated progress pixels when reading progress is disabled", () => {
    const context = { ...measure, fillRect: vi.fn(), fillText: vi.fn(), fillStyle: "", font: "", textAlign: "center", textBaseline: "middle" } as unknown as CanvasRenderingContext2D;
    const plan = createRenderPlan("one two three", { ...DEFAULT_SETTINGS, showProgress: false }, context);
    paintFrame(context, plan, plan.frameCount - 1);
    expect(vi.mocked(context.fillRect).mock.calls.filter(([, y, , height]) => y === plan.height - 4 && height === 4)).toHaveLength(0);
  });
  it("starts below the frame and finishes above it using the shared travel geometry", () => {
    const context = { ...measure, fillRect: vi.fn(), fillText: vi.fn(), fillStyle: "", font: "", textAlign: "center", textBaseline: "middle" } as unknown as CanvasRenderingContext2D;
    const plan = createRenderPlan("one line", { ...DEFAULT_SETTINGS, leadInSeconds: 1 }, context);
    paintFrame(context, plan, plan.leadInFrames);
    expect(vi.mocked(context.fillText).mock.calls[0]?.[2]).toBe(plan.height + plan.lineHeightPx / 2);
    vi.mocked(context.fillText).mockClear();
    paintFrame(context, plan, plan.frameCount - 1);
    expect(vi.mocked(context.fillText).mock.calls[0]?.[2]).toBeCloseTo(-plan.lineHeightPx / 2);
  });
  it("keeps Unicode, long words, paragraph breaks, large type, and long scripts renderable", () => {
    const longWord = "supercalifragilisticexpialidocious";
    expect(wrapText(`Hello 👋🏽 世界 ${longWord}\n\nनमस्ते`, 80, measure)).toEqual(expect.arrayContaining(["👋🏽 世界", longWord, "", "नमस्ते"]));
    const longText = Array.from({ length: 2_000 }, (_, index) => index % 25 === 0 ? `paragraph-${index}\n` : `word-${index}`).join(" ");
    const plan = createRenderPlan(longText, { ...DEFAULT_SETTINGS, fontSize: 90, lineHeight: 1.8 }, measure);
    expect(plan.lineHeightPx).toBe(162);
    expect(plan.lines.length).toBeGreaterThan(100);
    expect(plan.frameCount).toBeGreaterThan(0);
    expect(Number.isFinite(plan.travel)).toBe(true);
  });
});
