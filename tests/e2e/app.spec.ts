import { expect, test } from "@playwright/test";

test("landing explains the private workflow", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Talk like|Your words/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Try it right now|Paste your script|Skip to the good take/ }).first()).toHaveAttribute("href", "/teleprompter");
  await expect(page.locator("body")).toHaveCSS("overflow-x", "hidden");
});

test("landing exposes crawlable open graph tags", async ({ page, request }) => {
  await page.goto("/");
  const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
  expect(ogImage).toMatch(/^https:\/\//);
  expect(ogImage).not.toMatch(/localhost|127\.0\.0\.1/);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /Frameline/);
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "website");
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", /^https:\/\//);
  const image = await request.get("/opengraph-image");
  expect(image.ok()).toBeTruthy();
  expect(image.headers()["content-type"]).toMatch(/image\/png/);
});

test("script editing gives immediate feedback and persists locally", async ({ page }) => {
  await page.goto("/teleprompter");
  await expect(page.locator(".app-header-meta")).toContainText("0:00");
  const editor = page.getByLabel("Your script");
  await editor.fill("A short script for a confident first take.");
  await expect(page.locator(".script-status").getByText("8 words")).toBeVisible();
  if ((page.viewportSize()?.width ?? 0) <= 760) {
    const clearBox = await page.getByRole("button", { name: "Clear script" }).boundingBox();
    expect(clearBox?.width).toBeGreaterThanOrEqual(44);
    expect(clearBox?.height).toBeGreaterThanOrEqual(44);
    await page.getByRole("button", { name: "Preview", exact: true }).click();
    for (const buttonName of ["Pause preview", "Restart preview"]) {
      const box = await page.getByRole("button", { name: buttonName }).boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
  }
  await expect(page.getByLabel("Reading window").getByLabel("A short script for a confident first take.")).toBeVisible();
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

test("prepares video frames from the client canvas", async ({ page }) => {
  test.setTimeout(90_000);
  await page.addInitScript(() => {
    Object.defineProperty(document, "pictureInPictureEnabled", { configurable: true, value: true });
  });
  await page.goto("/teleprompter");
  const supportsWebCodecs = await page.evaluate(async () => {
    if (!("VideoEncoder" in globalThis) || !("VideoFrame" in globalThis)) return false;
    const result = await VideoEncoder.isConfigSupported({ codec: "vp8", width: 900, height: 300, framerate: 30, bitrate: 650_000 });
    return result.supported === true;
  });
  test.skip(!supportsWebCodecs, "The installed browser does not expose the VP8 WebCodecs pipeline.");

  await page.getByRole("button", { name: "Tune", exact: true }).click();
  await page.getByRole("slider", { name: "Start delay" }).focus();
  await page.keyboard.press("ArrowRight");
  await page.getByRole("button", { name: "Close settings" }).click();
  await page.getByLabel("Your script").fill("A short smoke test for locally generated teleprompter frames.");
  if ((page.viewportSize()?.width ?? 0) <= 760) await page.getByRole("button", { name: "Preview", exact: true }).click();
  await expect(page.getByRole("button", { name: "Restart preview" })).toBeVisible();
  await expect.poll(() => page.locator(".preview-viewport").evaluate((element) => getComputedStyle(element).getPropertyValue("--preview-delay"))).toBe("1s");
  await expect.poll(() => page.locator(".preview-viewport").evaluate((element) => parseFloat(getComputedStyle(element).getPropertyValue("--preview-duration")))).toBeCloseTo(4.5);
  await page.getByRole("button", { name: "Prepare floating teleprompter" }).dispatchEvent("click");
  await expect.poll(() => page.locator(".preview-script").evaluate((element) => getComputedStyle(element).animationPlayState)).toBe("paused");
  await expect(page.getByRole("button", { name: "Open floating teleprompter" })).toBeVisible({ timeout: 60_000 });
  await expect(page.getByRole("group", { name: "Prepared video controls" })).toBeVisible();
  await expect(page.getByLabel("Prepared teleprompter video")).toBeVisible();
  expect((await page.getByLabel("Prepared teleprompter video").boundingBox())?.width).toBeGreaterThan(280);
  const playPrepared = page.getByRole("button", { name: "Play prepared video" });
  await playPrepared.click();
  await expect(page.getByRole("button", { name: "Pause prepared video" })).toBeVisible();
  await expect.poll(() => page.getByLabel("Prepared teleprompter video").evaluate((video: HTMLVideoElement) => video.playbackRate)).toBe(1);
  await page.getByLabel("Prepared teleprompter video").evaluate((video: HTMLVideoElement) => { video.currentTime = 1.01; video.dispatchEvent(new Event("timeupdate")); });
  await expect.poll(() => page.getByLabel("Prepared teleprompter video").evaluate((video: HTMLVideoElement) => video.playbackRate)).toBeCloseTo(0.8);
  await page.getByRole("button", { name: "Tune", exact: true }).click();
  await page.getByRole("slider", { name: "Speed" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => page.getByLabel("Prepared teleprompter video").evaluate((video: HTMLVideoElement) => video.playbackRate)).toBeCloseTo(121 / 150);
  await page.getByRole("button", { name: "Close settings" }).click();
  await page.getByLabel("Prepared teleprompter video").evaluate((video: HTMLVideoElement) => { video.currentTime = Math.min(2, video.duration / 2); video.dispatchEvent(new Event("timeupdate")); });
  await page.getByRole("button", { name: "Restart prepared video" }).click();
  await expect(page.locator(".prepared-heading output")).toContainText("0:00 /");
  await expect.poll(() => page.getByLabel("Prepared teleprompter video").evaluate((video: HTMLVideoElement) => video.playbackRate)).toBe(1);

  const preparedBox = await page.getByLabel("Prepared teleprompter video").boundingBox();
  const preparedAspect = (preparedBox?.width ?? 0) / (preparedBox?.height ?? 1);
  await page.getByRole("button", { name: "Tune", exact: true }).click();
  await page.getByLabel("Window shape").selectOption("16:9");
  await page.getByRole("button", { name: "Close settings" }).click();
  await expect(page.getByRole("button", { name: "Recompile teleprompter" })).toBeVisible();
  const staleBox = await page.getByLabel("Prepared teleprompter video").boundingBox();
  expect((staleBox?.width ?? 0) / (staleBox?.height ?? 1)).toBeCloseTo(preparedAspect, 1);

  if ((page.viewportSize()?.width ?? 0) <= 760) await page.getByRole("button", { name: "Script", exact: true }).dispatchEvent("click");
  await page.getByLabel("Your script").fill("An updated smoke test for locally generated teleprompter frames.");
  await expect(page.getByRole("button", { name: "Recompile teleprompter" })).toBeVisible();
  await page.getByRole("button", { name: "Recompile teleprompter" }).dispatchEvent("click");
  await expect.poll(() => page.getByLabel("Prepared teleprompter video").evaluate((video: HTMLVideoElement) => ({ paused: video.paused, hasSource: video.hasAttribute("src") }))).toEqual({ paused: true, hasSource: false });
  await expect(page.getByRole("button", { name: "Open floating teleprompter" })).toBeVisible({ timeout: 60_000 });
});

test("tune offers touch-friendly help and controls reading progress", async ({ page }) => {
  await page.goto("/teleprompter");
  await page.getByRole("button", { name: "Tune", exact: true }).click();
  const isPhone = (page.viewportSize()?.width ?? 0) <= 760;
  const guideHelp = page.getByRole("button", { name: "About Center guide" });
  const progressHelp = page.getByRole("button", { name: "About Reading progress" });
  const settingsDialog = page.getByRole("dialog", { name: "Reading setup" });
  await expect(settingsDialog).toBeVisible();
  await expect(settingsDialog).toHaveAttribute("data-slot", isPhone ? "drawer-popup" : "dialog-content");
  await page.waitForTimeout(200);
  const originalDialogBox = await settingsDialog.boundingBox();

  const sliderChanges = [
    { name: "Speed", expected: "121 wpm" },
    { name: "Text size", expected: "43 px" },
    { name: "Line spacing", expected: "1.6" },
    { name: "Start delay", expected: "1 sec" },
    { name: "Side padding", expected: "57 px" },
  ];
  for (const slider of sliderChanges) {
    const control = page.getByRole("slider", { name: slider.name });
    await control.focus();
    await page.keyboard.press("ArrowRight");
    await expect(settingsDialog.getByText(slider.expected, { exact: true })).toBeVisible();
  }
  await expect(settingsDialog).not.toContainText("NaN");
  await expect.poll(async () => {
    const viewport = page.locator(".preview-viewport");
    const padding = await viewport.evaluate((element) => parseFloat(getComputedStyle(element).getPropertyValue("--preview-padding")));
    const scale = await viewport.evaluate((element) => parseFloat(getComputedStyle(element).getPropertyValue("--preview-scale")));
    return padding / scale;
  }).toBeCloseTo(57);

  if (isPhone) {
    for (const control of [
      page.getByRole("button", { name: "Close settings" }),
      page.getByLabel("Window shape"),
      page.getByLabel("Alignment"),
      page.getByLabel("Text color"),
      page.getByLabel("Background color"),
    ]) {
      const box = await control.boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
  }

  if (isPhone) {
    await guideHelp.click();
  } else {
    await guideHelp.hover();
  }
  const guideDescription = page.getByText(/keep the active line close to the camera/);
  await expect(guideDescription).toBeVisible();
  if (!isPhone) await expect(guideDescription).toHaveCSS("padding-left", "14px");

  if (!isPhone) {
    const hoveredDialogBox = await settingsDialog.boundingBox();
    expect(hoveredDialogBox?.width).toBeCloseTo(originalDialogBox?.width ?? 0, 0);
    expect(hoveredDialogBox?.height).toBeCloseTo(originalDialogBox?.height ?? 0, 0);
  }

  const progressToggle = page.getByRole("switch", { name: "Reading progress" });
  await expect(progressToggle).toBeChecked();
  if (isPhone) {
    await progressHelp.click();
  } else {
    await page.mouse.move(0, 0);
    await progressToggle.focus();
    await page.keyboard.press("Tab");
    await expect(progressHelp).toBeFocused();
  }
  await expect(page.getByText(/preview and prepared video/)).toBeVisible();
  if (!isPhone) await expect(page.getByText(/keep the active line close to the camera/)).toBeHidden();
  await progressToggle.click();
  await page.getByRole("button", { name: "Close settings" }).click();
  await expect(page.locator(".reading-progress-track")).toHaveCount(0);
});

test("preview renders canonical planned lines across newlines, widths, and aspect ratios", async ({ page }) => {
  await page.goto("/teleprompter");
  const text = `${Array.from({ length: 42 }, () => "measured").join(" ")}\n\nFinal paragraph 👋🏽`;
  await page.getByLabel("Your script").fill(text);
  if ((page.viewportSize()?.width ?? 0) <= 760) await page.getByRole("button", { name: "Preview", exact: true }).click();
  const viewport = page.locator(".preview-viewport");
  await expect.poll(() => viewport.getAttribute("data-canonical-width")).toBe("900");
  const plannedCount = Number(await viewport.getAttribute("data-line-count"));
  await expect(page.locator(".preview-line")).toHaveCount(plannedCount);
  await expect(page.locator('.preview-line[data-blank="true"]')).toHaveCount(1);
  await expect(page.locator(".preview-script")).toHaveCSS("font-family", '"Inter Variable", sans-serif');
  await expect(page.locator(".preview-script")).toHaveCSS("font-weight", "600");
  await expect.poll(async () => {
    const width = (await viewport.boundingBox())?.width ?? 0;
    const scale = await viewport.evaluate((element) => Number(getComputedStyle(element).getPropertyValue("--preview-scale")));
    return scale / width;
  }).toBeCloseTo(1 / 900);
  const expectCanonicalStage = async (ratio: number) => {
    await expect.poll(async () => {
      const box = await viewport.boundingBox();
      return (box?.width ?? 0) / (box?.height ?? 1);
    }).toBeCloseTo(ratio, 2);
    const shell = await page.locator(".preview").boundingBox();
    const stage = await viewport.boundingBox();
    expect(Math.abs((stage?.width ?? 0) - (shell?.width ?? 0))).toBeLessThan(1);
    expect(Math.abs((stage?.height ?? 0) - (shell?.height ?? 0))).toBeLessThan(1);
    expect(Math.abs((stage?.x ?? 0) + (stage?.width ?? 0) / 2 - ((shell?.x ?? 0) + (shell?.width ?? 0) / 2))).toBeLessThan(1);
    expect(Math.abs((stage?.y ?? 0) + (stage?.height ?? 0) / 2 - ((shell?.y ?? 0) + (shell?.height ?? 0) / 2))).toBeLessThan(1);
  };
  await expectCanonicalStage(3);

  const script = page.locator(".preview-script");
  const progress = page.locator(".reading-progress-track");
  await expect.poll(async () => {
    const shell = await page.locator(".preview").boundingBox();
    const track = await progress.boundingBox();
    return Math.abs((shell?.y ?? 0) + (shell?.height ?? 0) - ((track?.y ?? 0) + (track?.height ?? 0)));
  }).toBeLessThan(1);
  const firstAnimationKey = await script.getAttribute("data-animation-key");
  await expect(progress).toHaveAttribute("data-animation-key", firstAnimationKey ?? "");
  await page.waitForTimeout(150);
  await page.getByRole("button", { name: "Restart preview" }).click();
  await expect.poll(() => script.getAttribute("data-animation-key")).not.toBe(firstAnimationKey);
  const restartedKey = await script.getAttribute("data-animation-key");
  await expect(progress).toHaveAttribute("data-animation-key", restartedKey ?? "");
  const animationTimes = await page.evaluate(() => {
    const textAnimation = document.querySelector(".preview-script")?.getAnimations()[0];
    const progressAnimation = document.querySelector(".reading-progress")?.getAnimations()[0];
    return { textStart: Number(textAnimation?.startTime), progressStart: Number(progressAnimation?.startTime) };
  });
  expect(Math.abs(animationTimes.textStart - animationTimes.progressStart)).toBeLessThan(1);

  await page.getByRole("button", { name: "Tune", exact: true }).click();
  await page.getByLabel("Window shape").selectOption("4:3");
  await page.getByRole("button", { name: "Close settings" }).click();
  await expect.poll(() => viewport.getAttribute("data-canonical-width")).toBe("720");
  await expect.poll(async () => {
    const width = (await viewport.boundingBox())?.width ?? 0;
    const scale = await viewport.evaluate((element) => Number(getComputedStyle(element).getPropertyValue("--preview-scale")));
    return scale / width;
  }).toBeCloseTo(1 / 720);
  await expectCanonicalStage(4 / 3);

  await page.getByRole("button", { name: "Tune", exact: true }).click();
  await page.getByLabel("Window shape").selectOption("16:9");
  await page.getByRole("button", { name: "Close settings" }).click();
  await expectCanonicalStage(16 / 9);
});

test("keeps primary controls reachable in a narrow landscape with 200% root text size", async ({ page }) => {
  await page.setViewportSize({ width: 740, height: 360 });
  await page.goto("/teleprompter");
  await expect(page.getByRole("heading", { name: "Frameline teleprompter" })).toBeAttached();
  await page.waitForTimeout(200);
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  const dock = page.getByRole("navigation", { name: "Teleprompter controls" });
  await expect(dock).toBeVisible();
  await expect(page.getByRole("button", { name: "Preview", exact: true })).toHaveAttribute("aria-pressed", "false");
  await page.getByRole("button", { name: "Tune", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Reading setup" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Close settings" })).toBeInViewport();
  await expect(page.getByRole("button", { name: "Done" })).toBeInViewport();
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});
