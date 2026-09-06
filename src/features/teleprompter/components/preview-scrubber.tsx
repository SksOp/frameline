"use client";

import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { formatTime } from "../format-time";

const POLL_INTERVAL_MS = 200;

type PreviewScrubberProps = {
  totalSeconds: number;
  /** Changes whenever the preview animation remounts so the readout snaps back to the start. */
  resetKey: string;
  readPosition(): number | null;
  onSeek(seconds: number): void;
};

/** Position slider and readout for the animated preview; polls the live animation clock at a low rate. */
export function PreviewScrubber({ totalSeconds, resetKey, readPosition, onSeek }: PreviewScrubberProps) {
  const [position, setPosition] = useState(0);
  const max = Math.max(0.1, totalSeconds);

  useEffect(() => {
    setPosition(0);
    const publish = () => {
      const current = readPosition();
      if (current === null) return;
      setPosition((previous) => Math.abs(previous - current) < 0.05 ? previous : current);
    };
    const interval = setInterval(publish, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [readPosition, resetKey]);

  const handleValueChange = (next: number | readonly number[]) => {
    const candidate = Array.isArray(next) ? next[0] : next;
    if (!Number.isFinite(candidate)) return;
    const clamped = Math.min(max, Math.max(0, candidate));
    setPosition(clamped);
    onSeek(clamped);
  };

  return <div className="mt-2.5 flex items-center gap-3 motion-reduce:hidden" data-slot="preview-scrubber">
    <Slider className="flex min-h-11 items-center" aria-label="Preview position" value={[Math.min(max, position)]} min={0} max={max} step={0.5} largeStep={10} onValueChange={handleValueChange} />
    <output className="shrink-0 font-mono text-[0.65rem] font-extrabold tabular-nums" aria-live="off" data-slot="preview-position">{formatTime(position)} / {formatTime(totalSeconds)}</output>
  </div>;
}
