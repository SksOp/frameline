// DESIGN SYSTEM: Migrated to the current design.md.
import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-[4px] border-2 border-input bg-background px-3 py-2.5 text-base transition-[box-shadow,border-color,background] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:shadow-[4px_4px_0_var(--fl-violet)] disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-50 aria-invalid:border-destructive md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
