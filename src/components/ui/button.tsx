// DESIGN SYSTEM: Migrated to the current design.md.
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-bold whitespace-nowrap shadow-none transition-[background-color,border-color,color,box-shadow,transform] duration-(--duration-fast) ease-(--ease-standard) outline-none select-none hover:-translate-y-0.5 focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-0 active:shadow-none disabled:pointer-events-none disabled:translate-y-0 disabled:border-disabled disabled:bg-disabled disabled:text-disabled-foreground disabled:opacity-100 aria-busy:pointer-events-none aria-busy:cursor-progress aria-invalid:border-danger aria-invalid:ring-[3px] aria-invalid:ring-danger/25 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "border-primary bg-primary text-primary-foreground shadow-(--shadow-sm) hover:bg-brand-coral",
        outline:
          "border-border bg-surface text-foreground hover:bg-surface-inset aria-expanded:border-primary aria-expanded:bg-brand-coral-soft",
        secondary:
          "border-border bg-secondary text-secondary-foreground hover:bg-surface-inset aria-expanded:border-primary aria-expanded:bg-brand-coral-soft",
        ghost:
          "hover:bg-surface-inset hover:text-foreground aria-expanded:bg-brand-coral-soft aria-expanded:text-foreground",
        destructive:
          "border-danger bg-danger text-destructive-foreground shadow-(--shadow-sm) hover:bg-danger/90 focus-visible:ring-danger",
        link: "text-primary underline-offset-4 hover:translate-y-0 hover:underline",
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
        "icon-lg": "size-12",
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
