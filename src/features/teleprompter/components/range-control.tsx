import { Slider } from "@/components/ui/slider";

type RangeControlProps = { label: string; value: number; min: number; max: number; step?: number; suffix?: string; onChange(value: number): void };

export function RangeControl({ label, value, min, max, step = 1, suffix = "", onChange }: RangeControlProps) {
  const labelId = `${label.toLowerCase().replaceAll(" ", "-")}-label`;
  const handleValueChange = (next: number | readonly number[]) => {
    const candidate = Array.isArray(next) ? next[0] : undefined;
    if (!Number.isFinite(candidate)) return;
    onChange(Math.min(max, Math.max(min, candidate)));
  };
  return <div className="control range-control">
    <div className="control-label"><span id={labelId}>{label}</span><output>{value}{suffix}</output></div>
    <Slider aria-labelledby={labelId} value={[value]} min={min} max={max} step={step} onValueChange={handleValueChange} />
  </div>;
}
