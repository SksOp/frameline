"use client";

import { useState, type RefObject } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  return <section className={`prepared-output${sessionState === "ready" ? " is-ready" : ""}`} aria-labelledby="prepared-heading">
    <div className="prepared-heading"><div><span className="pane-kicker">Record</span><h3 id="prepared-heading">Playback check</h3></div><output aria-live="off">{formatTime(currentTime)} / {formatTime(duration)}</output></div>
    <video
      ref={videoRef} className="prepared-video" aria-label="Prepared teleprompter video" playsInline loop={loop}
      onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)}
      onEmptied={resetTimeline}
      onSeeking={onPlaybackPositionChange}
      onLoadedMetadata={(event) => readTimeline(event.currentTarget)} onDurationChange={(event) => readTimeline(event.currentTarget)}
      onTimeUpdate={(event) => readTimeline(event.currentTarget)} onSeeked={(event) => readTimeline(event.currentTarget)}
    />
    <div className="prepared-controls" role="group" aria-label="Prepared video controls">
      <Button variant="secondary" aria-label={playing ? "Pause prepared video" : "Play prepared video"} onClick={() => playing ? onPause() : void onPlay()}>
        {playing ? <Pause /> : <Play />}<span>{playing ? "Pause" : "Play"}</span>
      </Button>
      <Button variant="secondary" aria-label="Restart prepared video" onClick={restart}><RotateCcw /><span>Restart</span></Button>
    </div>
  </section>;
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}
