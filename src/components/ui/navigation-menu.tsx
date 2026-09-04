// DESIGN SYSTEM: Migrated to the current design.md.
"use client"

import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu"
import { cva } from "class-variance-authority"
import { cn } from "cn"
import { ChevronDownIcon } from "lucide-react"

function NavigationMenu({
  align = "start",
  className,
  children,
  ...props
}: NavigationMenuPrimitive.Root.Props &
  Pick<NavigationMenuPrimitive.Positioner.Props, "align">) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center text-foreground",
        className
      )}
      {...props}
    >
      {children}
      <NavigationMenuPositioner align={align} />
    </NavigationMenuPrimitive.Root>
  )
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "group flex flex-1 list-none items-center justify-center gap-1",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  )
}

const navigationMenuTriggerStyle = cva(
  "group/navigation-menu-trigger inline-flex h-11 w-max items-center justify-center rounded-md border border-transparent bg-transparent px-3 py-2 text-sm font-bold text-foreground shadow-none transition-[background-color,border-color,color,box-shadow] duration-(--duration-fast) ease-(--ease-standard) outline-none hover:bg-surface-inset focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:bg-surface-strong disabled:pointer-events-none disabled:border-disabled disabled:bg-disabled disabled:text-disabled-foreground disabled:opacity-100 aria-busy:pointer-events-none aria-busy:cursor-progress data-popup-open:border-border data-popup-open:bg-surface-elevated data-popup-open:shadow-(--shadow-sm) data-open:border-border data-open:bg-surface-elevated data-open:shadow-(--shadow-sm) motion-reduce:transition-none"
)

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: NavigationMenuPrimitive.Trigger.Props) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon className="relative top-px ml-1 size-3.5 transition-transform duration-(--duration-standard) ease-(--ease-standard) group-data-popup-open/navigation-menu-trigger:rotate-180 group-data-open/navigation-menu-trigger:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
    </NavigationMenuPrimitive.Trigger>
  )
}

function NavigationMenuContent({
  className,
  ...props
}: NavigationMenuPrimitive.Content.Props) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "h-full w-auto p-2 text-popover-foreground transition-[opacity,translate] duration-(--duration-slow) ease-(--ease-standard) data-ending-style:opacity-0 data-starting-style:opacity-0 data-ending-style:data-activation-direction=left:translate-x-[18%] data-ending-style:data-activation-direction=right:-translate-x-[18%] data-starting-style:data-activation-direction=left:-translate-x-[18%] data-starting-style:data-activation-direction=right:translate-x-[18%] group-data-[viewport=false]/navigation-menu:rounded-xl group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:border-border group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:shadow-(--shadow-lg) motion-reduce:translate-x-0 motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuPositioner({
  className,
  side = "bottom",
  sideOffset = 8,
  align = "start",
  alignOffset = 0,
  ...props
}: NavigationMenuPrimitive.Positioner.Props) {
  return (
    <NavigationMenuPrimitive.Portal>
      <NavigationMenuPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        className={cn(
          "isolate z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom] duration-(--duration-standard) ease-(--ease-standard) data-instant:transition-none data-[side=bottom]:before:absolute data-[side=bottom]:before:inset-x-0 data-[side=bottom]:before:-top-3 data-[side=bottom]:before:h-3 motion-reduce:transition-none",
          className
        )}
        {...props}
      >
        <NavigationMenuPrimitive.Popup className="relative h-(--popup-height) w-(--popup-width) origin-(--transform-origin) rounded-xl border border-border bg-popover text-popover-foreground shadow-(--shadow-lg) transition-[opacity,width,height,translate] duration-(--duration-slow) ease-(--ease-standard) outline-none data-ending-style:-translate-y-2 data-ending-style:opacity-0 data-starting-style:-translate-y-2 data-starting-style:opacity-0 motion-reduce:translate-y-0 motion-reduce:transition-none">
          <NavigationMenuPrimitive.Viewport className="relative size-full overflow-hidden" />
        </NavigationMenuPrimitive.Popup>
      </NavigationMenuPrimitive.Positioner>
    </NavigationMenuPrimitive.Portal>
  )
}

function NavigationMenuLink({
  className,
  ...props
}: NavigationMenuPrimitive.Link.Props) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "flex min-h-11 items-center gap-2 rounded-md border border-transparent p-3 text-sm font-semibold text-foreground transition-[background-color,border-color,color,box-shadow,transform] duration-(--duration-fast) ease-(--ease-standard) outline-none hover:-translate-y-0.5 hover:bg-surface-inset focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-popover active:translate-y-0 active:bg-surface-strong aria-disabled:pointer-events-none aria-disabled:border-disabled aria-disabled:bg-disabled aria-disabled:text-disabled-foreground data-active:border-primary data-active:bg-brand-coral-soft data-active:text-foreground [&_svg:not([class*='size-'])]:size-4 motion-reduce:transform-none motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof NavigationMenuPrimitive.Icon>) {
  return (
    <NavigationMenuPrimitive.Icon
      data-slot="navigation-menu-indicator"
      className={cn(
        "top-full z-1 flex h-2 items-end justify-center overflow-hidden text-border transition-opacity duration-(--duration-fast) data-[state=hidden]:opacity-0 data-[state=visible]:opacity-100 motion-reduce:transition-none",
        className
      )}
      {...props}
    >
      <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm border-t border-l border-border bg-popover shadow-(--shadow-sm)" />
    </NavigationMenuPrimitive.Icon>
  )
}

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuPositioner,
}
