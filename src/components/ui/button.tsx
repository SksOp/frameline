// DESIGN SYSTEM: Migrated to the current design.md.
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[4px] border-2 border-transparent bg-clip-padding text-sm font-extrabold whitespace-nowrap transition-[transform,box-shadow,background,color,border-color] duration-150 outline-none select-none focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ring active:not-aria-[haspopup]:translate-x-[3px] active:not-aria-[haspopup]:translate-y-[3px] active:not-aria-[haspopup]:shadow-none disabled:pointer-events-none disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-none disabled:opacity-45 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "border-foreground bg-primary text-primary-foreground shadow-[4px_4px_0_var(--fl-pink)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[var(--fl-violet)] hover:text-white hover:shadow-[6px_6px_0_var(--fl-pink)] hover:[&_svg]:translate-x-0.5",
        outline:
          "border-foreground bg-background text-foreground shadow-[3px_3px_0_var(--fl-ink)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-accent hover:shadow-[5px_5px_0_var(--fl-ink)] aria-expanded:bg-accent",
        secondary:
          "border-foreground bg-secondary text-secondary-foreground shadow-[3px_3px_0_var(--fl-ink)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[var(--fl-pink)] hover:shadow-[5px_5px_0_var(--fl-ink)] aria-expanded:bg-[var(--fl-pink)]",
        ghost:
          "border-transparent shadow-none hover:border-foreground hover:bg-accent hover:text-foreground aria-expanded:border-foreground aria-expanded:bg-accent",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-11 gap-2 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-2 px-5 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        icon: "size-11",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
