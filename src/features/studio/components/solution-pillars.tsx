import Link from "next/link";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { studioProducts } from "../product-catalog";
import { studioSolutions } from "../studio-solutions";
import { solutionIcons } from "./solution-icons";
import { StudioEyebrow } from "./studio-eyebrow";

export function SolutionPillars({ compact = false }: { compact?: boolean }) {
  return (
    <div className={cn("grid grid-cols-1 gap-5 min-[42.001rem]:grid-cols-2", compact && "min-[68.001rem]:grid-cols-5")}>
      {studioSolutions.map((solution, index) => {
        const Icon = solutionIcons[solution.iconKind];
        const relatedSlugs: readonly string[] = solution.relatedProductSlugs;
        const related = studioProducts.filter((product) => relatedSlugs.includes(product.slug));
        return (
          <Card render={<article id={compact ? undefined : solution.slug} />} key={solution.slug} className={cn("rounded-xl p-0 text-text-primary", !compact && index === 0 && "min-[42.001rem]:col-span-full", compact && "min-h-64 border-text-secondary bg-text-primary text-text-inverted min-[68.001rem]:min-h-80")}>
            <CardHeader className="flex grid-cols-none flex-row items-center justify-between px-5 pt-5 text-brand-coral-strong min-[42.001rem]:px-8 min-[42.001rem]:pt-8">
              <span className="font-mono text-xs font-semibold">0{index + 1}</span><Icon className="size-7" aria-hidden="true" />
            </CardHeader>
            <CardContent className="flex flex-1 flex-col px-5 pb-5 min-[42.001rem]:px-8 min-[42.001rem]:pb-8">
              <StudioEyebrow tone={compact ? "inverted" : "default"} spacing={compact ? "push" : "offset"}>{solution.name}</StudioEyebrow>
              <h3 className={cn("mb-4 max-w-[14ch] font-display text-[clamp(2rem,4vw,3.5rem)] font-[560] leading-[0.95] tracking-[-0.04em]", compact && "text-[1.65rem]")}>{solution.headline}</h3>
              <p className={cn("max-w-148 leading-[1.6] text-text-secondary", compact && "text-surface-inset")}>{solution.description}</p>
              {compact ? <Link className={cn(buttonVariants({ variant: "link" }), "mt-5 w-fit text-accent-gold")} href={`/solutions#${solution.slug}`}>See how it works</Link> : null}
            </CardContent>
            {!compact ? <CardFooter className="block bg-transparent px-8 py-5">
              <p className="mb-4 text-sm leading-[1.55] text-text-secondary">{solution.evidence}</p>
              <ul className="flex list-none flex-wrap gap-2" aria-label={`Products related to ${solution.name}`}>
                {related.map((product) => <li className="flex min-h-8 items-center gap-2 rounded-full bg-surface-inset px-3 py-1 text-xs" key={product.slug}>{product.availability === "available" ? <Link className="font-bold" href={product.productHref}>{product.name}</Link> : <span>{product.name}</span>}<small className="text-text-subtle">{product.availability === "available" ? "Available" : "Direction"}</small></li>)}
              </ul>
            </CardFooter> : null}
          </Card>
        );
      })}
    </div>
  );
}
