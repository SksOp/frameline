const BASE64URL_PATTERN = /^[A-Za-z0-9_-]*$/;

function base64UrlToBase64(value: string): string {
  const padLength = (4 - (value.length % 4)) % 4;
  return value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(padLength);
}

function base64ToBase64Url(value: string): string {
  return value.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function encodeTextToShareParam(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return base64ToBase64Url(btoa(binary));
}

export function decodeShareParamToText(value: string): string | null {
  if (!BASE64URL_PATTERN.test(value)) return null;
  try {
    const binary = atob(base64UrlToBase64(value));
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder(undefined, { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
}

export function decodeShareParamToJson(value: string): unknown | null {
  const text = decodeShareParamToText(value);
  if (text === null) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
