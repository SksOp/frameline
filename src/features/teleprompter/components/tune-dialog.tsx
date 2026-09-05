'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { useMediaQuery } from '../hooks/use-media-query';
import type { ThemePreference } from '../hooks/use-theme';
import { HORIZONTAL_PADDING_BOUNDS, type TeleprompterSettings } from '../types';
import { PaneKicker, PaneTitle } from './pane-header';
import { RangeControl } from './range-control';
import { SettingWithInfo } from './setting-with-info';
import { ToolButton } from './tool-button';

type SettingUpdater = <Key extends keyof TeleprompterSettings>(
  key: Key,
  value: TeleprompterSettings[Key],
) => void;
type TuneDialogProps = {
  open: boolean;
  settings: TeleprompterSettings;
  onClose(): void;
  onSettingChange: SettingUpdater;
  theme?: ThemePreference;
  onThemeChange?: (theme: ThemePreference) => void;
};

const surfaceClass =
  'flex flex-col gap-0 overflow-hidden bg-surface-elevated p-0 shadow-(--shadow-lg)';
const headerClass =
  'block border-b border-divider bg-surface-strong px-[22px] py-[18px] max-[760px]:px-[18px] max-[760px]:pt-3 max-[760px]:pb-[13px]';
const fieldsetClass = 'm-0 block border-0 py-5 max-[760px]:py-4';
const legendClass =
  'w-max rounded-full bg-brand-coral-soft px-[7px] py-[5px] font-mono text-[0.62rem] font-[850] text-brand-coral-strong';
const gridClass =
  'grid grid-cols-2 gap-x-[26px] gap-y-1 max-[760px]:grid-cols-1 max-[760px]:gap-0';
const controlClass = 'min-w-0 border-b border-divider py-3.5';
const controlLabelClass =
  'mb-[9px] flex justify-between gap-2 text-[0.75rem] font-extrabold';

export function TuneDialog({
  open,
  settings,
  onClose,
  onSettingChange,
  theme,
  onThemeChange,
}: TuneDialogProps) {
  const phone = useMediaQuery('(max-width: 760px)');
  const controls = (
    <TuneControls
      settings={settings}
      update={onSettingChange}
      theme={theme}
      onThemeChange={onThemeChange}
    />
  );
  const footer = <SettingsFooter onClose={onClose} />;
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) onClose();
  };

  if (phone) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange} showSwipeHandle>
        <DrawerContent
          className={`${surfaceClass} max-h-[88dvh] w-full rounded-t-xl border-x-0 border-b-0`}
        >
          <DrawerHeader className={headerClass}>
            <TuneHeading
              title={<DrawerTitle render={<PaneTitle />}>Reading setup</DrawerTitle>}
              onClose={onClose}
            />
            <DrawerDescription className="sr-only">
              Adjust reading speed and the appearance of the teleprompter.
            </DrawerDescription>
          </DrawerHeader>
          {controls}
          {footer}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={`${surfaceClass} max-h-[min(780px,calc(100dvh-40px))] w-[min(780px,calc(100%-40px))] max-w-[780px] rounded-xl sm:max-w-[780px]`}
        showCloseButton={false}
      >
        <DialogHeader className={headerClass}>
          <TuneHeading
            title={<DialogTitle render={<PaneTitle />}>Reading setup</DialogTitle>}
            onClose={onClose}
          />
          <DialogDescription className="sr-only">
            Adjust reading speed and the appearance of the teleprompter.
          </DialogDescription>
        </DialogHeader>
        {controls}
        {footer}
      </DialogContent>
    </Dialog>
  );
}

function TuneHeading({
  title,
  onClose,
}: {
  title: React.ReactNode;
  onClose(): void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <PaneKicker>Tune</PaneKicker>
        {title}
      </div>
      <ToolButton iconOnly aria-label="Close settings" onClick={onClose}>
        <X />
      </ToolButton>
    </div>
  );
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
  return (
    <div className="overflow-auto bg-surface-elevated px-[22px] pt-1 pb-[22px] max-[760px]:px-[18px] max-[760px]:pt-0.5 max-[760px]:pb-[18px]">
      <fieldset className={fieldsetClass}>
        <legend className={legendClass}>Reading</legend>
        <div className={gridClass}>
          <RangeControl
            label="Speed"
            value={settings.wordsPerMinute}
            min={75}
            max={300}
            suffix=" wpm"
            onChange={(value) => update('wordsPerMinute', value)}
          />
          <RangeControl
            label="Text size"
            value={settings.fontSize}
            min={36}
            max={90}
            suffix=" px"
            onChange={(value) => update('fontSize', value)}
          />
          <RangeControl
            label="Line spacing"
            value={settings.lineHeight}
            min={1}
            max={1.8}
            step={0.1}
            onChange={(value) => update('lineHeight', value)}
          />
          <RangeControl
            label="Start delay"
            value={settings.leadInSeconds}
            min={0}
            max={10}
            suffix=" sec"
            onChange={(value) => update('leadInSeconds', value)}
          />
          <RangeControl
            label="Side padding"
            value={settings.horizontalPadding}
            min={HORIZONTAL_PADDING_BOUNDS.min}
            max={HORIZONTAL_PADDING_BOUNDS.max}
            suffix=" px"
            onChange={(value) => update('horizontalPadding', value)}
          />
        </div>
      </fieldset>
      <fieldset className={`${fieldsetClass} border-t border-divider`}>
        <legend className={legendClass}>Frame</legend>
        <div className={gridClass}>
          <label className={controlClass}>
            <span className={controlLabelClass}>Window shape</span>
            <NativeSelect
              className="w-full"
              value={settings.aspectRatio}
              onChange={(event) =>
                update(
                  'aspectRatio',
                  event.target.value as TeleprompterSettings['aspectRatio'],
                )
              }
            >
              <NativeSelectOption value="3:1">Wide · 3:1</NativeSelectOption>
              <NativeSelectOption value="16:9">Video · 16:9</NativeSelectOption>
              <NativeSelectOption value="4:3">Classic · 4:3</NativeSelectOption>
            </NativeSelect>
          </label>
          <label className={controlClass}>
            <span className={controlLabelClass}>Alignment</span>
            <NativeSelect
              className="w-full"
              value={settings.alignment}
              onChange={(event) =>
                update(
                  'alignment',
                  event.target.value as TeleprompterSettings['alignment'],
                )
              }
            >
              <NativeSelectOption value="center">Centered</NativeSelectOption>
              <NativeSelectOption value="left">Left</NativeSelectOption>
            </NativeSelect>
          </label>
          <label className={`${controlClass} flex items-center justify-between`}>
            <span className={`${controlLabelClass} mb-0`}>Text color</span>
            <input
              className="h-11 w-12 cursor-pointer rounded-sm border border-border bg-surface shadow-(--shadow-sm)"
              aria-label="Text color"
              type="color"
              value={settings.textColor}
              onChange={(event) => update('textColor', event.target.value)}
            />
          </label>
          <label className={`${controlClass} flex items-center justify-between`}>
            <span className={`${controlLabelClass} mb-0`}>Background</span>
            <input
              className="h-11 w-12 cursor-pointer rounded-sm border border-border bg-surface shadow-(--shadow-sm)"
              aria-label="Background color"
              type="color"
              value={settings.backgroundColor}
              onChange={(event) =>
                update('backgroundColor', event.target.value)
              }
            />
          </label>
          <SettingWithInfo
            id="guide"
            label="Center guide"
            description="Shows two marks at eye level to help you keep the active line close to the camera."
            checked={settings.showGuide}
            onChange={(checked) => update('showGuide', checked)}
          />
          <SettingWithInfo
            id="progress"
            label="Reading progress"
            description="Adds a green timeline to the preview and prepared video so you can judge how much of the script remains."
            checked={settings.showProgress}
            onChange={(checked) => update('showProgress', checked)}
          />
          <SettingWithInfo
            id="loop"
            label="Loop attempts"
            description="Restarts the prepared video automatically after it reaches the end. This does not require recompiling."
            checked={settings.loop}
            onChange={(checked) => update('loop', checked)}
          />
        </div>
      </fieldset>
      {onThemeChange && (
        <fieldset className={`${fieldsetClass} border-t border-divider`}>
          <legend className={legendClass}>App</legend>
          <div className={gridClass}>
            <label className={controlClass}>
              <span className={controlLabelClass}>Appearance</span>
              <NativeSelect
                className="w-full"
                value={theme ?? 'system'}
                onChange={(event) =>
                  onThemeChange(event.target.value as ThemePreference)
                }
              >
                <NativeSelectOption value="system">
                  System (default)
                </NativeSelectOption>
                <NativeSelectOption value="dark">Dark mode</NativeSelectOption>
                <NativeSelectOption value="light">
                  Light mode
                </NativeSelectOption>
              </NativeSelect>
            </label>
          </div>
        </fieldset>
      )}
    </div>
  );
}

function SettingsFooter({ onClose }: { onClose(): void }) {
  return (
    <footer className="flex items-center justify-between gap-[18px] border-t border-divider bg-surface-strong px-[22px] py-3.5 max-[760px]:px-[18px] max-[760px]:pt-3 max-[760px]:pb-[calc(12px+env(safe-area-inset-bottom))] max-[480px]:justify-end">
      <span className="font-mono text-[0.68rem] font-bold text-text-secondary max-[480px]:hidden">
        Changes update the preview instantly.
      </span>
      <Button className="min-h-11 max-[480px]:w-full" onClick={onClose}>
        Done
      </Button>
    </footer>
  );
}
