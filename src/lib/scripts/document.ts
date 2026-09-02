export const SCRIPT_VERSION = 1 as const;

export interface ScriptDocumentV1 {
  version: typeof SCRIPT_VERSION;
  body: string;
  updatedAt: number;
}

export type ScriptDocument = ScriptDocumentV1;

export function normalizeScript(input: string): string {
  return input
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[\t ]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function createScriptDocument(body = ""): ScriptDocument {
  return { version: SCRIPT_VERSION, body: normalizeScript(body), updatedAt: Date.now() };
}

export function migrateScriptDocument(value: unknown): ScriptDocument | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Record<string, unknown>;
  if (candidate.version !== 1 || typeof candidate.body !== "string") return null;
  return {
    version: SCRIPT_VERSION,
    body: normalizeScript(candidate.body),
    updatedAt: typeof candidate.updatedAt === "number" ? candidate.updatedAt : Date.now(),
  };
}

export function countWords(text: string): number {
  const normalized = normalizeScript(text);
  return normalized ? normalized.split(/\s+/u).length : 0;
}

export function estimateDurationSeconds(text: string, wordsPerMinute: number): number {
  if (wordsPerMinute <= 0) return 0;
  return Math.ceil((countWords(text) / wordsPerMinute) * 60);
}
