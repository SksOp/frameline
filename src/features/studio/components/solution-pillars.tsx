import { Focus, Gift, MonitorSmartphone, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { studioProducts } from "../product-catalog";
import { studioSolutions, type SolutionIconKind } from "../studio-solutions";

const solutionIcons = {
  focus: Focus,
  shield: ShieldCheck,
  device: MonitorSmartphone,
  bolt: Zap,
  gift: Gift,
} satisfies Record<SolutionIconKind, typeof Focus>;

export function SolutionPillars({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`studio-solution-grid${compact ? " studio-solution-grid--compact" : ""}`}>
      {studioSolutions.map((solution, index) => {
        const Icon = solutionIcons[solution.iconKind];
        const relatedSlugs: readonly string[] = solution.relatedProductSlugs;
        const related = studioProducts.filter((product) => relatedSlugs.includes(product.slug));

        return (
          <article className="studio-solution-card" id={compact ? undefined : solution.slug} key={solution.slug}>
            <header><span>0{index + 1}</span><Icon aria-hidden="true" /></header>
            <p className="studio-eyebrow">{solution.name}</p>
            <h3>{solution.headline}</h3>
            <p>{solution.description}</p>
            {compact ? (
              <Link className="studio-text-link" href={`/solutions#${solution.slug}`}>See how it works</Link>
            ) : (
              <footer>
                <p>{solution.evidence}</p>
                <ul aria-label={`Products related to ${solution.name}`}>
                  {related.map((product) => (
                    <li key={product.slug}>
                      {product.availability === "available" ? <Link href={product.productHref}>{product.name}</Link> : <span>{product.name}</span>}
                      <small>{product.availability === "available" ? "Available" : "Direction"}</small>
                    </li>
                  ))}
                </ul>
              </footer>
            )}
          </article>
        );
      })}
    </div>
  );
}
