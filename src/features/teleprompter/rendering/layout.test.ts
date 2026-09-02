import { describe, expect, it } from "vitest";
import { wrapText, visibleLineRange } from "./layout";
import { createRenderPlan, playbackRate, timestampUs } from "./plan";
import { DEFAULT_SETTINGS } from "../types";

const measure = { measureText: (text: string) => ({ width: text.length * 10 }) };
describe("rendering", () => {
  it("wraps deterministically and preserves paragraphs", () => expect(wrapText("one two\n\nthree", 45, measure)).toEqual(["one", "two", "", "three"]));
  it("selects bounded visible lines", () => expect(visibleLineRange(50, 100, 25, 20)).toEqual({ first: 1, last: 7 }));
  it("builds stable timing", () => {
    const plan = createRenderPlan("one two three", DEFAULT_SETTINGS, measure);
    expect(plan.frameCount).toBe(Math.ceil(plan.durationSeconds * 30));
    expect(timestampUs(30)).toBe(1_000_000);
    expect(playbackRate(300)).toBe(2);
  });
});
