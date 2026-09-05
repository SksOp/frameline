// DESIGN SYSTEM: Migrated to the current design.md.
import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "min-h-11 w-full min-w-0 rounded-md border border-input bg-surface px-3 py-2 text-base text-foreground shadow-(--shadow-sm) transition-[background-color,border-color,box-shadow] duration-(--duration-fast) outline-none file:mr-3 file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-bold file:text-foreground placeholder:text-muted-foreground hover:bg-surface-elevated focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-disabled disabled:bg-disabled disabled:text-disabled-foreground disabled:opacity-100 aria-busy:cursor-progress aria-invalid:border-danger aria-invalid:ring-[3px] aria-invalid:ring-danger/25 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
