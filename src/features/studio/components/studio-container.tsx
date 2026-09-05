import type { ReactNode } from "react";
import { cn } from "cn";

export function StudioContainer({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-[min(calc(100%_-_2_*_var(--content-gutter)),var(--content-max))]", className)}>{children}</div>;
}
