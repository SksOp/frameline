import type { ComponentProps, ReactNode } from "react";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";

/** The sage step marker that labels each stage of the write → practice → record path. */
export function PaneKicker({ children }: { children: ReactNode }) {
  return <Badge variant="secondary" className="mb-[5px] block min-h-0 w-max rounded-full border-0 px-1.5 py-1 text-[0.7rem] font-bold tracking-[0.02em] shadow-none">{children}</Badge>;
}

/**
 * The workspace display heading. Its utilities intentionally win over an incoming
 * className so it can also back `DialogTitle render={<PaneTitle />}`.
 */
export function PaneTitle({ className, ...props }: ComponentProps<"h2">) {
  return <h2 {...props} className={cn(className, "m-0 font-display text-[1.45rem] leading-[1.05] font-[650] tracking-[-0.025em] max-[760px]:text-[1.15rem]")} />;
}

export function PaneHeader({ kicker, title, titleId, children }: { kicker: ReactNode; title: ReactNode; titleId: string; children?: ReactNode }) {
  return (
    <div className="mb-[18px] flex min-h-[52px] items-center justify-between gap-4 max-[760px]:mb-3 max-[760px]:min-h-12">
      <div>
        <PaneKicker>{kicker}</PaneKicker>
        <PaneTitle id={titleId}>{title}</PaneTitle>
      </div>
      {children}
    </div>
  );
}
