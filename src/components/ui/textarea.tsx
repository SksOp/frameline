// DESIGN SYSTEM: Migrated to the current design.md.
import * as React from "react"
import { cn } from "cn"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full rounded-md border border-input bg-surface px-3 py-2.5 text-base text-foreground shadow-(--shadow-sm) transition-[background-color,border-color,box-shadow] duration-(--duration-fast) outline-none placeholder:text-muted-foreground hover:bg-surface-elevated focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:border-disabled disabled:bg-disabled disabled:text-disabled-foreground disabled:opacity-100 aria-busy:cursor-progress aria-invalid:border-danger aria-invalid:ring-[3px] aria-invalid:ring-danger/25 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
