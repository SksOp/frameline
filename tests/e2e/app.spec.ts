import { expect, test } from "@playwright/test";

test("landing explains the private workflow", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Your words/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Paste your script/ })).toHaveAttribute("href", "/teleprompter");
  await expect(page.locator("body")).toHaveCSS("overflow-x", "hidden");
});

test("script editing gives immediate feedback and persists locally", async ({ page }) => {
  await page.goto("/teleprompter");
  const editor = page.getByLabel("Your script");
  await editor.fill("A short script for a confident first take.");
  await expect(page.getByText("8 words")).toBeVisible();
  await expect(page.getByLabel("Reading window").getByText("A short script for a confident first take.")).toBeVisible();
  await expect.poll(async () => page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open("frameline-local", 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return new Promise<string>((resolve) => {
      const request = db.transaction("drafts").objectStore("drafts").get("current");
      request.onsuccess = () => resolve(request.result?.body ?? "");
    });
  })).toBe("A short script for a confident first take.");
  await page.reload();
  await expect(editor).toHaveValue("A short script for a confident first take.");
});
