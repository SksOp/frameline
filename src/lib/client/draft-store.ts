import { createScriptDocument, migrateScriptDocument, type ScriptDocument } from "@/lib/scripts/document";

const DB = "frameline-local";
const STORE = "drafts";
const KEY = "current";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const draftStore = {
  async load(): Promise<ScriptDocument> {
    const db = await openDb();
    return new Promise((resolve) => {
      const request = db.transaction(STORE).objectStore(STORE).get(KEY);
      request.onsuccess = () => resolve(migrateScriptDocument(request.result) ?? createScriptDocument());
      request.onerror = () => resolve(createScriptDocument());
    });
  },
  async save(document: ScriptDocument): Promise<void> {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const request = db.transaction(STORE, "readwrite").objectStore(STORE).put(document, KEY);
      request.onsuccess = () => resolve(); request.onerror = () => reject(request.error);
    });
  },
  async clear(): Promise<void> {
    const db = await openDb();
    await new Promise<void>((resolve) => { const r = db.transaction(STORE, "readwrite").objectStore(STORE).delete(KEY); r.onsuccess = () => resolve(); });
  },
};
