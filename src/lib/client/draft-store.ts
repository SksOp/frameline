import { createScriptDocument, migrateScriptDocument, type ScriptDocument } from "@/lib/scripts/document";

const DB = "frameline-local";
const STORE = "drafts";
const KEY = "current";

function databaseError(message: string, cause?: DOMException | null) {
  return cause ?? new Error(message);
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB, 1);
    let settled = false;
    const rejectOnce = (error: Error | DOMException) => {
      if (settled) return;
      settled = true;
      reject(error);
    };

    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) {
        request.result.createObjectStore(STORE);
      }
    };
    request.onsuccess = () => {
      if (settled) {
        request.result.close();
        return;
      }
      settled = true;
      resolve(request.result);
    };
    request.onerror = () => rejectOnce(databaseError("The local draft database could not open.", request.error));
    request.onblocked = () => rejectOnce(new Error("The local draft database is blocked by another tab."));
  });
}

function transactionFailure(
  transaction: IDBTransaction,
  message: string,
  request?: IDBRequest,
) {
  return databaseError(message, request?.error ?? transaction.error);
}

async function loadDraft(): Promise<ScriptDocument> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    let transaction: IDBTransaction;
    let request: IDBRequest;
    let document = createScriptDocument();
    let settled = false;
    const finish = (callback: () => void) => {
      if (settled) return;
      settled = true;
      try { db.close(); }
      finally { callback(); }
    };

    try {
      transaction = db.transaction(STORE, "readonly");
      request = transaction.objectStore(STORE).get(KEY);
    } catch (cause) {
      try { db.close(); }
      finally { reject(cause); }
      return;
    }

    request.onsuccess = () => {
      document = migrateScriptDocument(request.result) ?? createScriptDocument();
    };
    request.onerror = () => finish(() => reject(transactionFailure(transaction, "The local draft could not be read.", request)));
    transaction.oncomplete = () => finish(() => resolve(document));
    transaction.onerror = () => finish(() => reject(transactionFailure(transaction, "The local draft read failed.", request)));
    transaction.onabort = () => finish(() => reject(transactionFailure(transaction, "The local draft read was aborted.", request)));
  });
}

async function writeDraft(
  operation: (store: IDBObjectStore) => IDBRequest,
  failureMessage: string,
): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    let transaction: IDBTransaction;
    let request: IDBRequest;
    let settled = false;
    const finish = (callback: () => void) => {
      if (settled) return;
      settled = true;
      try { db.close(); }
      finally { callback(); }
    };

    try {
      transaction = db.transaction(STORE, "readwrite");
      request = operation(transaction.objectStore(STORE));
    } catch (cause) {
      try { db.close(); }
      finally { reject(cause); }
      return;
    }

    request.onerror = () => finish(() => reject(transactionFailure(transaction, failureMessage, request)));
    transaction.oncomplete = () => finish(resolve);
    transaction.onerror = () => finish(() => reject(transactionFailure(transaction, failureMessage, request)));
    transaction.onabort = () => finish(() => reject(transactionFailure(transaction, failureMessage, request)));
  });
}

let writeQueue: Promise<void> = Promise.resolve();

function enqueueWrite(operation: () => Promise<void>) {
  const result = writeQueue.then(operation, operation);
  writeQueue = result.then(() => undefined, () => undefined);
  return result;
}

export const draftStore = {
  load: loadDraft,
  save(document: ScriptDocument): Promise<void> {
    return enqueueWrite(() => writeDraft(
      (store) => store.put(document, KEY),
      "The local draft could not be saved.",
    ));
  },
  clear(): Promise<void> {
    return enqueueWrite(() => writeDraft(
      (store) => store.delete(KEY),
      "The local draft could not be removed.",
    ));
  },
};
