// DESIGN SYSTEM: Migrated to the current design.md.
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const badgeVariants = cva(
  "group/badge inline-flex min-h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2.5 py-0.5 text-xs font-bold whitespace-nowrap transition-[background-color,border-color,color,box-shadow] duration-(--duration-fast) focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-disabled:pointer-events-none aria-disabled:bg-disabled aria-disabled:text-disabled-foreground aria-invalid:border-danger aria-invalid:ring-[3px] aria-invalid:ring-danger/25 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "border-primary bg-primary text-primary-foreground [a]:hover:bg-brand-coral",
        secondary:
          "border-accent-sage bg-accent-sage-soft text-accent-sage-strong [a]:hover:bg-accent-sage",
        destructive:
          "border-danger/30 bg-danger-surface text-danger [a]:hover:bg-danger/15",
        outline:
          "border-border bg-surface text-foreground [a]:hover:bg-surface-inset",
        ghost:
          "border-transparent text-foreground hover:bg-surface-inset",
        link: "border-transparent text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
