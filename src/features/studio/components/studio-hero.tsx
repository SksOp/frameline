import Link from "next/link";
import { ArrowRight, Code2, Focus, LockKeyhole, Workflow } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FramelineMark } from "./frameline-logo";
import { StudioContainer } from "./studio-container";

const eyebrowClass = "mb-3 text-[0.8125rem] font-[750] uppercase tracking-[0.08em] text-brand-coral-strong";

export function StudioHero() {
  return <StudioContainer className="grid items-center gap-16 py-12 min-[42.001rem]:py-16 min-[68.001rem]:min-h-[min(50rem,calc(100svh-4.75rem))] min-[68.001rem]:grid-cols-[minmax(0,0.9fr)_minmax(30rem,1.1fr)]">
    <section className="mx-auto max-w-224 text-center min-[68.001rem]:mx-0 min-[68.001rem]:max-w-172 min-[68.001rem]:text-left" aria-labelledby="studio-hero-title">
      <p className={eyebrowClass}>A private creative toolkit</p>
      <h1 className="font-display text-[clamp(3.5rem,9vw,8rem)] font-[560] leading-[0.88] tracking-[-0.065em]" id="studio-hero-title">Make the thing.<br /><em className="font-inherit text-brand-coral">Skip the setup.</em></h1>
      <p className="mx-auto mt-5 mb-7 max-w-176 text-[clamp(1.0625rem,2.5vw,1.25rem)] leading-[1.6] text-text-secondary min-[68.001rem]:mx-0">Frameline is a growing studio of focused creator tools. Open what you need, work in your browser, and keep your files on your device whenever the job allows.</p>
      <div className="flex flex-col items-stretch justify-center gap-5 min-[42.001rem]:flex-row min-[42.001rem]:items-center min-[68.001rem]:justify-start"><Link className={buttonVariants()} href="/studio">Open Studio <ArrowRight data-icon="inline-end" aria-hidden="true" /></Link><Link className={buttonVariants({ variant: "link" })} href="/products">Explore the tools</Link></div>
    </section>
    <div className="relative isolate mx-auto min-h-116 w-full max-w-184 min-[42.001rem]:min-h-152" aria-label="Frameline makes focused, private creator tools">
      <span className="absolute top-1/2 left-1/2 -z-2 aspect-square w-[min(30rem,78%)] -translate-1/2 rounded-full bg-accent-gold" aria-hidden="true"><span className="absolute -right-[12%] -bottom-[5%] aspect-square w-[68%] rounded-full bg-brand-coral-soft" /></span>
      <Card render={<article />} className="absolute top-1/2 left-1/2 z-2 min-h-88 w-[72%] -translate-1/2 rotate-2 rounded-2xl p-0 shadow-(--shadow-lg) motion-reduce:rotate-0 min-[42.001rem]:min-h-108 min-[42.001rem]:w-[64%]">
        <CardHeader className="flex grid-cols-none flex-row items-center gap-2 p-5 pb-0 text-[0.8125rem] font-[750] text-brand-coral-strong min-[42.001rem]:p-8 min-[42.001rem]:pb-0"><FramelineMark size={24} /> Frameline</CardHeader>
        <CardContent className="mt-auto flex flex-1 flex-col p-5 min-[42.001rem]:p-8"><h2 className="mt-auto mb-4 max-w-[8ch] font-display text-[clamp(2.5rem,5vw,4.5rem)] font-[560] leading-[0.9] tracking-[-0.05em]">Your browser is a studio.</h2><p className="text-text-secondary">One clear job at a time.</p><ul className="mt-5 flex list-none flex-wrap gap-2"><li><Badge variant="outline"><Focus aria-hidden="true" /> Focused</Badge></li><li><Badge variant="outline"><LockKeyhole aria-hidden="true" /> Private by default</Badge></li></ul></CardContent>
      </Card>
      <Card render={<article />} className="absolute top-[4%] left-0 z-3 min-h-26 min-w-29 -rotate-5 justify-end rounded-xl border-0 bg-accent-sage p-3 shadow-(--shadow-md) transition-transform hover:-translate-y-2 hover:-rotate-2 motion-reduce:transform-none min-[42.001rem]:min-h-32 min-[42.001rem]:min-w-40 min-[42.001rem]:p-4"><strong>Teleprompter</strong><small className="mt-1 text-[0.6875rem] text-text-secondary">Available now</small></Card>
      <Card render={<article />} className="absolute top-[8%] right-0 z-3 min-h-26 min-w-29 rotate-4 justify-end rounded-xl border-0 bg-brand-coral-soft p-3 shadow-(--shadow-md) transition-transform hover:-translate-y-2 hover:rotate-1 motion-reduce:transform-none min-[42.001rem]:min-h-32 min-[42.001rem]:min-w-40 min-[42.001rem]:p-4"><Code2 className="mb-auto size-6" aria-hidden="true" /><strong>Code motion</strong><small className="mt-1 text-[0.6875rem] text-text-secondary">In the studio</small></Card>
      <Card render={<article />} className="absolute right-0 bottom-[1%] z-3 min-h-26 min-w-29 -rotate-4 justify-end rounded-xl border-0 bg-accent-gold-soft p-3 shadow-(--shadow-md) transition-transform hover:-translate-y-2 hover:-rotate-1 motion-reduce:transform-none min-[42.001rem]:min-h-32 min-[42.001rem]:min-w-40 min-[42.001rem]:p-4"><Workflow className="mb-auto size-6" aria-hidden="true" /><strong>Workflow motion</strong><small className="mt-1 text-[0.6875rem] text-text-secondary">In the studio</small></Card>
    </div>
  </StudioContainer>;
}
