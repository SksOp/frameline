import { describe, expect, it } from "vitest";
import { decodeShareParamToJson, decodeShareParamToText, encodeTextToShareParam } from "./share-link";

describe("share-link", () => {
  it("round-trips plain text", () => {
    const text = "Hello, teleprompter!\nSecond line.";
    expect(decodeShareParamToText(encodeTextToShareParam(text))).toBe(text);
  });

  it("round-trips unicode text", () => {
    const text = "Café — emoji \u{1F3AC}";
    expect(decodeShareParamToText(encodeTextToShareParam(text))).toBe(text);
  });

  it("produces a urlsafe alphabet with no padding", () => {
    const encoded = encodeTextToShareParam("any script text at all");
    expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it("returns null for malformed input", () => {
    expect(decodeShareParamToText("not base64url!!!")).toBeNull();
    expect(decodeShareParamToText("####")).toBeNull();
  });

  it("decodes JSON payloads and rejects invalid ones", () => {
    const encoded = encodeTextToShareParam(JSON.stringify({ fontSize: 48 }));
    expect(decodeShareParamToJson(encoded)).toEqual({ fontSize: 48 });
    expect(decodeShareParamToJson(encodeTextToShareParam("not json"))).toBeNull();
    expect(decodeShareParamToJson("####")).toBeNull();
  });
});
