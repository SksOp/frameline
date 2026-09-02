import { describe, expect, it } from "vitest";
import { countWords, estimateDurationSeconds, migrateScriptDocument, normalizeScript } from "./document";

describe("script document", () => {
  it("normalizes whitespace while preserving paragraphs", () => {
    expect(normalizeScript("  Hello   world\r\n\r\n\r\nNext  line ")).toBe("Hello world\n\nNext line");
  });
  it("counts Unicode-separated words and estimates duration", () => {
    expect(countWords("Hello 👋 world\nagain")).toBe(4);
    expect(estimateDurationSeconds("one two three", 60)).toBe(3);
  });
  it("rejects unknown persisted versions", () => {
    expect(migrateScriptDocument({ version: 2, body: "no" })).toBeNull();
  });
});
