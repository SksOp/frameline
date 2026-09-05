import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const studioEyebrowVariants = cva(
  "mb-3 text-[0.8125rem] font-[750] uppercase tracking-[0.08em]",
  {
    variants: {
      tone: {
        default: "text-brand-coral-strong",
        inverted: "text-accent-gold",
      },
      spacing: {
        default: "",
        offset: "mt-9",
        push: "mt-auto",
      },
    },
    defaultVariants: {
      tone: "default",
      spacing: "default",
    },
  },
);

export type StudioEyebrowTone = NonNullable<VariantProps<typeof studioEyebrowVariants>["tone"]>;
export type StudioEyebrowSpacing = NonNullable<VariantProps<typeof studioEyebrowVariants>["spacing"]>;

export function StudioEyebrow({ children, tone, spacing }: { children: ReactNode; tone?: StudioEyebrowTone; spacing?: StudioEyebrowSpacing }) {
  return <p className={studioEyebrowVariants({ tone, spacing })}>{children}</p>;
}
