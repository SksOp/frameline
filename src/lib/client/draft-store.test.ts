import { afterEach, describe, expect, it, vi } from "vitest";
import { createScriptDocument } from "@/lib/scripts/document";
import { draftStore } from "./draft-store";

type FakeRequest = {
  result: unknown;
  error: DOMException | null;
  onsuccess: ((event: Event) => void) | null;
  onerror: ((event: Event) => void) | null;
  onupgradeneeded: ((event: Event) => void) | null;
  onblocked: ((event: Event) => void) | null;
};

type FakeTransaction = {
  error: DOMException | null;
  request: FakeRequest | null;
  oncomplete: ((event: Event) => void) | null;
  onerror: ((event: Event) => void) | null;
  onabort: ((event: Event) => void) | null;
  objectStore(): {
    get(): FakeRequest;
    put(): FakeRequest;
    delete(): FakeRequest;
  };
};

function request(): FakeRequest {
  return {
    result: undefined,
    error: null,
    onsuccess: null,
    onerror: null,
    onupgradeneeded: null,
    onblocked: null,
  };
}

function createIndexedDbHarness() {
  const operations: string[] = [];
  const transactions: FakeTransaction[] = [];
  const database = {
    objectStoreNames: { contains: () => true },
    createObjectStore: vi.fn(),
    close: vi.fn(),
    transaction: vi.fn(() => {
      const transaction: FakeTransaction = {
        error: null,
        request: null,
        oncomplete: null,
        onerror: null,
        onabort: null,
        objectStore: () => ({
          get: () => makeOperation("get"),
          put: () => makeOperation("put"),
          delete: () => makeOperation("delete"),
        }),
      };
      const makeOperation = (name: string) => {
        operations.push(name);
        transaction.request = request();
        return transaction.request;
      };
      transactions.push(transaction);
      return transaction;
    }),
  };
  const open = vi.fn(() => {
    const openRequest = request();
    queueMicrotask(() => {
      openRequest.result = database;
      openRequest.onsuccess?.(new Event("success"));
    });
    return openRequest;
  });
  vi.stubGlobal("indexedDB", { open });
  return { database, open, operations, transactions };
}

async function flushMicrotasks() {
  for (let index = 0; index < 6; index += 1) await Promise.resolve();
}

describe("draftStore", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("rejects a clear request error instead of leaving the promise pending", async () => {
    const harness = createIndexedDbHarness();
    const clear = draftStore.clear();
    await flushMicrotasks();
    const transaction = harness.transactions[0];
    transaction.request!.error = new DOMException("delete failed", "UnknownError");
    transaction.request!.onerror?.(new Event("error"));
    await expect(clear).rejects.toMatchObject({ message: "delete failed" });
    expect(harness.database.close).toHaveBeenCalled();
  });

  it("rejects aborted saves and failed reads", async () => {
    const saveHarness = createIndexedDbHarness();
    const save = draftStore.save(createScriptDocument("New words"));
    await flushMicrotasks();
    const saveTransaction = saveHarness.transactions[0];
    saveTransaction.error = new DOMException("save aborted", "AbortError");
    saveTransaction.onabort?.(new Event("abort"));
    await expect(save).rejects.toMatchObject({ message: "save aborted" });

    const loadHarness = createIndexedDbHarness();
    const load = draftStore.load();
    await flushMicrotasks();
    const loadTransaction = loadHarness.transactions[0];
    loadTransaction.request!.error = new DOMException("read failed", "UnknownError");
    loadTransaction.request!.onerror?.(new Event("error"));
    await expect(load).rejects.toMatchObject({ message: "read failed" });
  });

  it("serializes clear before a newer save so late deletion cannot win", async () => {
    const harness = createIndexedDbHarness();
    const clear = draftStore.clear();
    const save = draftStore.save(createScriptDocument("Newer words"));
    await flushMicrotasks();

    expect(harness.operations).toEqual(["delete"]);
    harness.transactions[0].oncomplete?.(new Event("complete"));
    await clear;
    await flushMicrotasks();

    expect(harness.operations).toEqual(["delete", "put"]);
    harness.transactions[1].oncomplete?.(new Event("complete"));
    await expect(save).resolves.toBeUndefined();
  });
});
