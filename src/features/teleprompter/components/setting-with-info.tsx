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

const infoButtonClass = "size-11 aria-expanded:border-brand-coral aria-expanded:bg-brand-coral-soft aria-expanded:shadow-none";

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
    <div className="grid grid-cols-[minmax(0,1fr)_44px] items-center border-b border-divider" data-slot="setting-with-info">
      <label className="flex min-h-[62px] min-w-0 items-center gap-3 py-3.5 text-[0.78rem] font-extrabold"><Switch size="sm" checked={checked} onCheckedChange={onChange} /><span>{label}</span></label>

      <div className="max-[760px]:hidden">
        <HoverCard>
          <HoverCardTrigger
            render={<Button className={infoButtonClass} size="icon" variant="ghost" />}
            delay={250}
            closeDelay={150}
            aria-label={`About ${label}`}
          >
            <Info />
          </HoverCardTrigger>
          <HoverCardContent
            className="w-[min(280px,calc(100vw-32px))] px-3.5 py-3 text-[0.75rem] leading-[1.55] font-[650] text-text-primary"
            side="right"
            sideOffset={8}
            align="center"
          >
            {description}
          </HoverCardContent>
        </HoverCard>
      </div>

      <Button
        className={`${infoButtonClass} hidden max-[760px]:inline-flex`}
        size="icon"
        variant="ghost"
        aria-label={`About ${label}`}
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((current) => !current)}
      >
        <Info />
      </Button>
      {open && (
        <p className="col-span-full -mt-0.5 mb-3 hidden rounded-md border border-border bg-surface-inset p-3 text-[0.72rem] leading-[1.5] text-text-secondary shadow-none max-[760px]:block" id={contentId}>
          {description}
        </p>
      )}
    </div>
  );
}
