// DESIGN SYSTEM: Migrated to the current design.md.
"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cn } from "cn"

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-border shadow-(--shadow-sm) transition-[background-color,border-color,box-shadow] duration-(--duration-fast) outline-none after:absolute after:-inset-x-2 after:-inset-y-3 focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-invalid:border-danger aria-invalid:ring-[3px] aria-invalid:ring-danger/25 data-[size=default]:h-6 data-[size=default]:w-11 data-[size=sm]:h-5 data-[size=sm]:w-9 data-checked:border-primary data-checked:bg-primary data-unchecked:bg-surface-inset data-disabled:cursor-not-allowed data-disabled:border-disabled data-disabled:bg-disabled data-disabled:opacity-100",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block rounded-full bg-surface-elevated shadow-(--shadow-sm) transition-transform duration-(--duration-fast) group-data-[size=default]/switch:size-5 group-data-[size=sm]/switch:size-4 group-data-[size=default]/switch:data-checked:translate-x-5 group-data-[size=sm]/switch:data-checked:translate-x-4 group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0 group-data-disabled/switch:bg-surface-strong"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
