"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Switch } from "@/components/ui/switch";

type SettingWithInfoProps = {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange(checked: boolean): void;
};

export function SettingWithInfo({
  id,
  label,
  description,
  checked,
  onChange,
}: SettingWithInfoProps) {
  const [open, setOpen] = useState(false);
  const contentId = `${id}-setting-info`;

  return (
    <div className="setting-with-info">
      <label className="switch"><Switch checked={checked} onCheckedChange={onChange} aria-label={label} /><span>{label}</span></label>

      <div className="desktop-setting-help">
        <HoverCard>
          <HoverCardTrigger
            render={<Button className="info-button" size="icon-lg" variant="ghost" />}
            delay={250}
            closeDelay={150}
            aria-label={`About ${label}`}
          >
            <Info />
          </HoverCardTrigger>
          <HoverCardContent
            className="teleprompter-surface setting-hover-card"
            side="right"
            sideOffset={8}
            align="center"
          >
            {description}
          </HoverCardContent>
        </HoverCard>
      </div>

      <Button
        className="info-button mobile-setting-help"
        size="icon-lg"
        variant="ghost"
        aria-label={`About ${label}`}
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((current) => !current)}
      >
        <Info />
      </Button>
      {open && (
        <p className="setting-info mobile-setting-info" id={contentId}>
          {description}
        </p>
      )}
    </div>
  );
}
