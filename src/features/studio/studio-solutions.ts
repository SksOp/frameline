import type { StudioSolutionTag } from "./product-catalog";

export type SolutionIconKind = "focus" | "shield" | "device" | "bolt" | "gift";

export type StudioSolution = Readonly<{
  slug: StudioSolutionTag;
  name: string;
  headline: string;
  description: string;
  evidence: string;
  iconKind: SolutionIconKind;
  relatedProductSlugs: readonly string[];
}>;

export const studioSolutions = [
  {
    slug: "focused",
    name: "Focused",
    headline: "One tool. One clear job.",
    description: "No dashboard maze or suite-sized learning curve. Each product starts with a specific creative task.",
    evidence: "Teleprompter is built around one path: write, practice, record.",
    iconKind: "focus",
    relatedProductSlugs: ["teleprompter", "code-animator", "workflow-animator"],
  },
  {
    slug: "private",
    name: "Private",
    headline: "Your files are not a growth strategy.",
    description: "We collect as little as the job allows and explain each product's privacy boundary before you use it.",
    evidence: "Teleprompter does not upload scripts or generated prompt video.",
    iconKind: "shield",
    relatedProductSlugs: ["teleprompter"],
  },
  {
    slug: "client-side",
    name: "Client-side",
    headline: "Use your device before our servers.",
    description: "When browser capabilities make it practical, processing happens where your work already is: on your device.",
    evidence: "Teleprompter currently renders and encodes in the browser; future tools are still directions, not technical promises.",
    iconKind: "device",
    relatedProductSlugs: ["teleprompter", "code-animator", "workflow-animator"],
  },
  {
    slug: "immediate",
    name: "Immediate",
    headline: "Open it. Make the thing.",
    description: "Available tools begin at a direct link, without account creation or an onboarding obstacle course.",
    evidence: "Teleprompter opens straight into the working tool when you are ready.",
    iconKind: "bolt",
    relatedProductSlugs: ["teleprompter", "code-animator"],
  },
  {
    slug: "free",
    name: "Free",
    headline: "A real free path.",
    description: "The tool available today is free to use, without watermarks or deliberate export degradation.",
    evidence: "Future product access will be described only when those products exist.",
    iconKind: "gift",
    relatedProductSlugs: ["teleprompter"],
  },
] as const satisfies readonly StudioSolution[];
