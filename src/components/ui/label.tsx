// DESIGN SYSTEM: Migrated to the current design.md.
"use client"

import * as React from "react"
import { cn } from "cn"

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-[0.8125rem] leading-[1.25] font-bold text-foreground select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:text-disabled-foreground peer-disabled:cursor-not-allowed peer-disabled:text-disabled-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Label }
