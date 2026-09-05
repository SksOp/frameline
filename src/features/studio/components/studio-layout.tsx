import type { ReactNode } from "react";
import { cn } from "cn";
import { StudioContainer } from "./studio-container";
import { StudioFooter } from "./studio-footer";
import { StudioNavigation } from "./studio-navigation";

const eyebrowClass = "mb-3 text-[0.8125rem] font-[750] uppercase tracking-[0.08em] text-brand-coral-strong";
const titleClass = "max-w-[17ch] font-display text-[clamp(3rem,8vw,7rem)] font-[560] leading-[0.92] tracking-[-0.05em]";

export function StudioShell({ children, mainClassName }: { children: ReactNode; mainClassName?: string }) {
  return (
    <div className="min-h-screen overflow-hidden bg-canvas">
      <StudioNavigation />
      <main className={mainClassName}>{children}</main>
      <StudioFooter />
    </div>
  );
}

export function StudioPageHero({
  eyebrow,
  title,
  titleId,
  lede,
  variant = "default",
  children,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  titleId: string;
  lede: ReactNode;
  variant?: "default" | "product";
  children?: ReactNode;
}) {
  return (
    <StudioContainer
      className={cn(
        "py-12 min-[42.001rem]:py-20",
        variant === "product" && "min-[58.001rem]:pr-96",
      )}
    >
      <div>
        <p className={eyebrowClass}>{eyebrow}</p>
        <h1 className={titleClass} id={titleId}>{title}</h1>
        <p className="mt-5 mb-7 max-w-176 text-[clamp(1.0625rem,2.5vw,1.25rem)] leading-[1.6] text-text-secondary">{lede}</p>
        {children}
      </div>
    </StudioContainer>
  );
}

export function StudioSectionHeading({
  eyebrow,
  title,
  titleId,
  description,
  tone = "default",
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  titleId: string;
  description?: ReactNode;
  tone?: "default" | "inverted";
}) {
  return (
    <div className="mb-8 grid items-end gap-4 min-[58.001rem]:grid-cols-[minmax(0,1.3fr)_minmax(16rem,0.7fr)] min-[58.001rem]:gap-16">
      <div>
        <p className={cn(eyebrowClass, tone === "inverted" && "text-accent-gold")}>{eyebrow}</p>
        <h2 className="max-w-[18ch] font-display text-[clamp(2.75rem,6vw,5.5rem)] font-[560] leading-[0.92] tracking-[-0.05em]" id={titleId}>{title}</h2>
      </div>
      {description ? <p className={cn("max-w-136 text-[1.0625rem] leading-[1.65] text-text-secondary", tone === "inverted" && "text-surface-inset")}>{description}</p> : null}
    </div>
  );
}

export { eyebrowClass, titleClass };
export { StudioContainer } from "./studio-container";
