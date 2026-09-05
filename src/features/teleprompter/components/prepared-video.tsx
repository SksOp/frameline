"use client";

import { useState, type RefObject } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { PaneKicker } from "./pane-header";
import type { SessionState } from "../use-teleprompter-session";

type PreparedVideoProps = {
  videoRef: RefObject<HTMLVideoElement | null>;
  sessionState: SessionState;
  loop: boolean;
  onPlay(): Promise<void>;
  onPause(): void;
  onRestart(): void;
  onPlaybackPositionChange(): void;
};

export function PreparedVideo({ videoRef, sessionState, loop, onPlay, onPause, onRestart, onPlaybackPositionChange }: PreparedVideoProps) {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const readTimeline = (video: HTMLVideoElement) => {
    setCurrentTime(Number.isFinite(video.currentTime) ? video.currentTime : 0);
    setDuration(Number.isFinite(video.duration) ? video.duration : 0);
    onPlaybackPositionChange();
  };
  const restart = () => { onRestart(); setCurrentTime(0); };
  const resetTimeline = () => {
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  };

  return <section className={cn("mt-[22px] border-t border-divider pt-5", sessionState !== "ready" && "hidden")} aria-labelledby="prepared-heading" data-slot="prepared-output" data-ready={sessionState === "ready" || undefined}>
    <div className="mb-3 flex items-end justify-between gap-4"><div><PaneKicker>Record</PaneKicker><h3 className="m-0 font-sans text-[1.05rem] font-black" id="prepared-heading">Playback check</h3></div><output className="font-mono text-[0.65rem] font-extrabold" aria-live="off">{formatTime(currentTime)} / {formatTime(duration)}</output></div>
    <video
      ref={videoRef} className="block h-auto max-h-[50dvh] w-full rounded-md border border-border bg-text-primary object-contain shadow-(--shadow-sm) max-[760px]:max-h-[42dvh]" aria-label="Prepared teleprompter video" playsInline loop={loop}
      onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)}
      onEmptied={resetTimeline}
      onSeeking={onPlaybackPositionChange}
      onLoadedMetadata={(event) => readTimeline(event.currentTarget)} onDurationChange={(event) => readTimeline(event.currentTarget)}
      onTimeUpdate={(event) => readTimeline(event.currentTarget)} onSeeked={(event) => readTimeline(event.currentTarget)}
    />
    <div className="mt-3 flex justify-end gap-2.5" role="group" aria-label="Prepared video controls">
      <Button variant="secondary" className="min-h-11" aria-label={playing ? "Pause prepared video" : "Play prepared video"} onClick={() => playing ? onPause() : void onPlay()}>
        {playing ? <Pause /> : <Play />}<span>{playing ? "Pause" : "Play"}</span>
      </Button>
      <Button variant="secondary" className="min-h-11" aria-label="Restart prepared video" onClick={restart}><RotateCcw /><span>Restart</span></Button>
    </div>
  </section>;
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}
