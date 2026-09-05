import { Focus, LockKeyhole, Zap } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StudioContainer, StudioSectionHeading } from "./studio-layout";

const principles = [
  { title: "Focused", copy: "One clear job per tool, with the creator's work—not our interface—at the center.", icon: Focus },
  { title: "Private", copy: "Teleprompter saves and prepares locally. Your script is never uploaded to Frameline.", icon: LockKeyhole },
  { title: "Immediate", copy: "No account ceremony. Open the tool, bring your words, and start making the take.", icon: Zap },
] as const;

export function StudioPrinciples() {
  return <section className="bg-text-primary py-20 text-text-inverted" aria-labelledby="principles-title"><StudioContainer>
    <StudioSectionHeading eyebrow="How we build" title="Creator care, built in." titleId="principles-title" description="A warm invitation outside. A clear, quiet journey once you are making." tone="inverted" />
    <div className="grid grid-cols-1 gap-5 min-[42.001rem]:grid-cols-3">{principles.map(({ title, copy, icon: Icon }, index) => (
      <Card render={<article />} key={title} className="min-h-64 rounded-xl border-text-secondary bg-transparent py-0 text-text-inverted transition-[transform,background-color] duration-(--duration-standard) ease-(--ease-buoyant) hover:-translate-y-2 hover:bg-text-secondary motion-reduce:transform-none min-[42.001rem]:min-h-80">
        <CardHeader className="flex grid-cols-none flex-row justify-end p-8 font-mono text-xs font-semibold"><span>0{index + 1}</span></CardHeader>
        <CardContent className="mt-auto p-8 pt-0"><Icon className="size-8 text-accent-gold" aria-hidden="true" /><h3 className="mt-5 mb-2 font-display text-4xl font-[560]">{title}</h3><p className="leading-[1.55] text-surface-inset">{copy}</p></CardContent>
      </Card>
    ))}</div>
  </StudioContainer></section>;
}
