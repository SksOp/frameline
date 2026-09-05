import { Slider } from "@/components/ui/slider";

type RangeControlProps = { label: string; value: number; min: number; max: number; step?: number; suffix?: string; onChange(value: number): void };

export function RangeControl({ label, value, min, max, step = 1, suffix = "", onChange }: RangeControlProps) {
  const labelId = `${label.toLowerCase().replaceAll(" ", "-")}-label`;
  const handleValueChange = (next: number | readonly number[]) => {
    const candidate = Array.isArray(next) ? next[0] : next;
    if (!Number.isFinite(candidate)) return;
    onChange(Math.min(max, Math.max(min, candidate)));
  };
  return <div className="min-w-0 border-b border-divider py-3.5" data-slot="range-control">
    <div className="mb-[9px] flex justify-between gap-2 text-[0.75rem] font-extrabold"><span id={labelId}>{label}</span><output className="rounded-sm bg-accent-gold-soft px-[5px] py-0.5 font-mono font-black">{value}{suffix}</output></div>
    <Slider className="flex min-h-11 items-center" aria-labelledby={labelId} value={[value]} min={min} max={max} step={step} onValueChange={handleValueChange} />
  </div>;
}
