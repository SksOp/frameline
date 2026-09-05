import type { ComponentProps } from "react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";

type ToolButtonProps = Omit<ComponentProps<typeof Button>, "variant" | "size"> & { iconOnly?: boolean };

/** The compact 44px workspace control shared by the header, panes, and settings surfaces. */
export function ToolButton({ className, iconOnly = false, ...props }: ToolButtonProps) {
  return (
    <Button
      variant="ghost"
      size={iconOnly ? "icon" : "default"}
      className={cn(
        "h-11 min-h-11 rounded-sm text-[0.72rem] font-[850] text-text-primary shadow-none hover:border-border hover:bg-brand-coral-soft hover:text-text-primary [&_svg:not([class*='size-'])]:size-[18px]",
        iconOnly ? "px-0" : "px-[11px]",
        className,
      )}
      {...props}
    />
  );
}
