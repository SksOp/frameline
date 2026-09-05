import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_SETTINGS, type TeleprompterSettings } from "../types";
import type { SessionState } from "../use-teleprompter-session";
import { PreparedVideo } from "./prepared-video";
import { TeleprompterDock } from "./teleprompter-dock";
import { TuneDialog } from "./tune-dialog";

afterEach(cleanup);

const action = { label: "Prepare", ariaLabel: "Prepare video", disabled: false };

function renderDock(overrides: Partial<Parameters<typeof TeleprompterDock>[0]> = {}) {
  return render(<TeleprompterDock
    mobileView="script"
    sessionState="idle"
    preparedVideoIsStale={false}
    action={action}
    onMobileViewChange={() => undefined}
    onOpenSettings={() => undefined}
    onPrimaryAction={() => undefined}
    {...overrides}
  />);
}

describe("TeleprompterDock", () => {
  it("marks the active mobile view with aria-pressed and reports switches", () => {
    const onMobileViewChange = vi.fn();
    renderDock({ onMobileViewChange });
    expect(screen.getByRole("button", { name: "Script" }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("button", { name: "Preview" }).getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(screen.getByRole("button", { name: "Preview" }));
    expect(onMobileViewChange).toHaveBeenCalledWith("preview");
  });

  it("labels and disables the primary action from the derived action state", () => {
    renderDock({ action: { label: "Prepare", ariaLabel: "Prepare video", disabled: true } });
    const primary = screen.getByRole("button", { name: "Prepare video" });
    expect(primary.hasAttribute("disabled")).toBe(true);
    expect(primary.textContent).toContain("Prepare");
  });

  // The primary action's surface is a finite state mapping with no behavioural signal.
  it.each([
    ["idle" as SessionState, false, "bg-brand-coral-strong"],
    ["generating" as SessionState, false, "bg-danger"],
    ["ready" as SessionState, false, "bg-positive"],
    ["ready" as SessionState, true, "bg-warning-surface"],
  ])("paints the %s primary action (stale: %s)", (sessionState, preparedVideoIsStale, expected) => {
    renderDock({ sessionState, preparedVideoIsStale });
    const primary = screen.getByRole("button", { name: "Prepare video" });
    expect(primary.dataset.sessionState).toBe(sessionState);
    expect(primary.className).toContain(expected);
  });
});

describe("PreparedVideo", () => {
  const props = {
    videoRef: createRef<HTMLVideoElement>(),
    loop: false,
    onPlay: async () => undefined,
    onPause: () => undefined,
    onRestart: () => undefined,
    onPlaybackPositionChange: () => undefined,
  };

  it("stays hidden until the prepared output is ready", () => {
    const view = render(<PreparedVideo {...props} sessionState="generating" />);
    const section = view.container.querySelector<HTMLElement>("[data-slot=prepared-output]")!;
    expect(section.dataset.ready).toBeUndefined();
    expect(section.className).toContain("hidden");

    view.rerender(<PreparedVideo {...props} sessionState="ready" />);
    expect(section.dataset.ready).toBe("true");
    expect(section.className).not.toContain("hidden");
    expect(screen.getByLabelText("Prepared teleprompter video")).not.toBeNull();
  });
});

describe("TuneDialog", () => {
  const matchMedia = (phone: boolean) => vi.fn().mockImplementation((query: string) => ({
    matches: phone && query === "(max-width: 760px)",
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  }));

  const renderTune = (settings: TeleprompterSettings, onSettingChange = vi.fn(), onClose = vi.fn()) => {
    render(<TuneDialog open settings={settings} onClose={onClose} onSettingChange={onSettingChange} />);
    return { onSettingChange, onClose };
  };

  beforeEach(() => vi.stubGlobal("matchMedia", matchMedia(false)));
  afterEach(() => vi.unstubAllGlobals());

  it("composes a labelled desktop dialog with working settings controls", () => {
    const { onSettingChange, onClose } = renderTune(DEFAULT_SETTINGS);
    const dialog = screen.getByRole("dialog");
    expect(dialog.dataset.slot).toBe("dialog-content");
    expect(screen.getByRole("heading", { name: "Reading setup" })).not.toBeNull();

    fireEvent.change(screen.getByLabelText("Text color"), { target: { value: "#123456" } });
    expect(onSettingChange).toHaveBeenCalledWith("textColor", "#123456");

    fireEvent.click(screen.getByRole("switch", { name: "Center guide" }));
    expect(onSettingChange).toHaveBeenCalledWith("showGuide", !DEFAULT_SETTINGS.showGuide);

    fireEvent.click(screen.getByRole("button", { name: "Done" }));
    expect(onClose).toHaveBeenCalled();
  });

  // jsdom cannot lay the Base UI thumb out, so the thumb input stays visibility:hidden.
  // The labelled Slider root is the contract RangeControl actually owns.
  it("exposes each reading slider through its visible label", () => {
    renderTune(DEFAULT_SETTINGS);
    for (const label of ["Speed", "Text size", "Line spacing", "Start delay", "Side padding"]) {
      expect(screen.getByRole("group", { name: label })).not.toBeNull();
    }
    expect(screen.getByText("120 wpm")).not.toBeNull();
  });

  it("opens phone help by tap without covering the settings surface", () => {
    vi.stubGlobal("matchMedia", matchMedia(true));
    renderTune(DEFAULT_SETTINGS);
    const help = screen.getAllByRole("button", { name: "About Center guide" }).at(-1)!;
    expect(help.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(help);
    expect(help.getAttribute("aria-expanded")).toBe("true");
    expect(document.getElementById(help.getAttribute("aria-controls")!)?.textContent).toContain("eye level");
  });

  it("swaps the desktop dialog for a drawer on phones", () => {
    vi.stubGlobal("matchMedia", matchMedia(true));
    renderTune(DEFAULT_SETTINGS);
    expect(document.querySelector("[data-slot=dialog-content]")).toBeNull();
    expect(document.querySelector("[data-slot=drawer-popup]")).not.toBeNull();
    expect(screen.getByRole("heading", { name: "Reading setup" })).not.toBeNull();
  });
});
