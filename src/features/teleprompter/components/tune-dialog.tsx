"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle,
} from "@/components/ui/drawer";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { useMediaQuery } from "../hooks/use-media-query";
import type { ThemePreference } from "../hooks/use-theme";
import { HORIZONTAL_PADDING_BOUNDS, type TeleprompterSettings } from "../types";
import { RangeControl } from "./range-control";
import { SettingWithInfo } from "./setting-with-info";

type SettingUpdater = <Key extends keyof TeleprompterSettings>(key: Key, value: TeleprompterSettings[Key]) => void;
type TuneDialogProps = {
  open: boolean;
  settings: TeleprompterSettings;
  onClose(): void;
  onSettingChange: SettingUpdater;
  theme?: ThemePreference;
  onThemeChange?: (theme: ThemePreference) => void;
};

export function TuneDialog({ open, settings, onClose, onSettingChange, theme, onThemeChange }: TuneDialogProps) {
  const phone = useMediaQuery("(max-width: 760px)");
  const controls = <TuneControls settings={settings} update={onSettingChange} theme={theme} onThemeChange={onThemeChange} />;
  const footer = <SettingsFooter onClose={onClose} />;
  const handleOpenChange = (nextOpen: boolean) => { if (!nextOpen) onClose(); };

  if (phone) {
    return <Drawer open={open} onOpenChange={handleOpenChange} showSwipeHandle>
      <DrawerContent className="teleprompter-surface settings-dialog settings-drawer">
        <DrawerHeader className="settings-header">
          <TuneHeading title={<DrawerTitle className="settings-title">Reading setup</DrawerTitle>} onClose={onClose} />
          <DrawerDescription className="sr-only">Adjust reading speed and the appearance of the teleprompter.</DrawerDescription>
        </DrawerHeader>
        {controls}{footer}
      </DrawerContent>
    </Drawer>;
  }

  return <Dialog open={open} onOpenChange={handleOpenChange}>
    <DialogContent className="teleprompter-surface settings-dialog" showCloseButton={false}>
      <DialogHeader className="settings-header">
        <TuneHeading title={<DialogTitle className="settings-title">Reading setup</DialogTitle>} onClose={onClose} />
        <DialogDescription className="sr-only">Adjust reading speed and the appearance of the teleprompter.</DialogDescription>
      </DialogHeader>
      {controls}{footer}
    </DialogContent>
  </Dialog>;
}

function TuneHeading({ title, onClose }: { title: React.ReactNode; onClose(): void }) {
  return <div className="settings-heading-row">
    <div><span className="pane-kicker">Tune</span>{title}</div>
    <Button className="tool-button icon-only" size="icon-lg" variant="ghost" aria-label="Close settings" onClick={onClose}><X /></Button>
  </div>;
}

function TuneControls({
  settings,
  update,
  theme,
  onThemeChange,
}: {
  settings: TeleprompterSettings;
  update: SettingUpdater;
  theme?: ThemePreference;
  onThemeChange?: (theme: ThemePreference) => void;
}) {
  return <div className="settings-body">
    <fieldset><legend>Reading</legend><div className="settings-grid">
      <RangeControl label="Speed" value={settings.wordsPerMinute} min={75} max={300} suffix=" wpm" onChange={(value) => update("wordsPerMinute", value)} />
      <RangeControl label="Text size" value={settings.fontSize} min={36} max={90} suffix=" px" onChange={(value) => update("fontSize", value)} />
      <RangeControl label="Line spacing" value={settings.lineHeight} min={1} max={1.8} step={0.1} onChange={(value) => update("lineHeight", value)} />
      <RangeControl label="Start delay" value={settings.leadInSeconds} min={0} max={10} suffix=" sec" onChange={(value) => update("leadInSeconds", value)} />
      <RangeControl label="Side padding" value={settings.horizontalPadding} min={HORIZONTAL_PADDING_BOUNDS.min} max={HORIZONTAL_PADDING_BOUNDS.max} suffix=" px" onChange={(value) => update("horizontalPadding", value)} />
    </div></fieldset>
    <fieldset><legend>Frame</legend><div className="settings-grid compact-settings">
      <label className="control"><span>Window shape</span><NativeSelect value={settings.aspectRatio} onChange={(event) => update("aspectRatio", event.target.value as TeleprompterSettings["aspectRatio"])}>
        <NativeSelectOption value="3:1">Wide · 3:1</NativeSelectOption><NativeSelectOption value="16:9">Video · 16:9</NativeSelectOption><NativeSelectOption value="4:3">Classic · 4:3</NativeSelectOption>
      </NativeSelect></label>
      <label className="control"><span>Alignment</span><NativeSelect value={settings.alignment} onChange={(event) => update("alignment", event.target.value as TeleprompterSettings["alignment"])}>
        <NativeSelectOption value="center">Centered</NativeSelectOption><NativeSelectOption value="left">Left</NativeSelectOption>
      </NativeSelect></label>
      <label className="control color-control"><span>Text color</span><input aria-label="Text color" type="color" value={settings.textColor} onChange={(event) => update("textColor", event.target.value)} /></label>
      <label className="control color-control"><span>Background</span><input aria-label="Background color" type="color" value={settings.backgroundColor} onChange={(event) => update("backgroundColor", event.target.value)} /></label>
      <SettingWithInfo id="guide" label="Center guide" description="Shows two marks at eye level to help you keep the active line close to the camera." checked={settings.showGuide} onChange={(checked) => update("showGuide", checked)} />
      <SettingWithInfo id="progress" label="Reading progress" description="Adds a green timeline to the preview and prepared video so you can judge how much of the script remains." checked={settings.showProgress} onChange={(checked) => update("showProgress", checked)} />
      <SettingWithInfo id="loop" label="Loop attempts" description="Restarts the prepared video automatically after it reaches the end. This does not require recompiling." checked={settings.loop} onChange={(checked) => update("loop", checked)} />
    </div></fieldset>
    {onThemeChange && (
      <fieldset><legend>App</legend><div className="settings-grid compact-settings">
        <label className="control"><span>Appearance</span><NativeSelect value={theme ?? "system"} onChange={(event) => onThemeChange(event.target.value as ThemePreference)}>
          <NativeSelectOption value="system">System (default)</NativeSelectOption>
          <NativeSelectOption value="dark">Dark mode</NativeSelectOption>
          <NativeSelectOption value="light">Light mode</NativeSelectOption>
        </NativeSelect></label>
      </div></fieldset>
    )}
  </div>;
}

function SettingsFooter({ onClose }: { onClose(): void }) {
  return <footer className="settings-footer"><span>Changes update the preview instantly.</span><Button className="button" onClick={onClose}>Done</Button></footer>;
}
