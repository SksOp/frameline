"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, LockKeyhole, Pause, PictureInPicture2, Play, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { detectCapabilities, type Capability } from "@/lib/client/capabilities";
import { draftStore } from "@/lib/client/draft-store";
import { countWords, createScriptDocument, estimateDurationSeconds } from "@/lib/scripts/document";
import { DEFAULT_SETTINGS, type TeleprompterSettings } from "./types";
import { useTeleprompterSession } from "./use-teleprompter-session";

function formatDuration(seconds: number) { const m = Math.floor(seconds / 60); return `${m}:${String(seconds % 60).padStart(2, "0")}`; }

export function TeleprompterApp() {
  const [text, setText] = useState("");
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [capabilities, setCapabilities] = useState<Capability[] | null>(null);
  const [draftReady, setDraftReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const { videoRef, state, progress, error, prepare, cancel, enterPip } = useTeleprompterSession();
  const words = useMemo(() => countWords(text), [text]);
  const duration = useMemo(() => estimateDurationSeconds(text, settings.wordsPerMinute), [text, settings.wordsPerMinute]);
  const unsupported = capabilities?.filter((item) => !item.supported) ?? [];

  useEffect(() => {
    let acceptDraft = true;
    const fallback = window.setTimeout(() => { acceptDraft = false; setDraftReady(true); }, 800);
    void draftStore.load().then((doc) => { if (acceptDraft) setText(doc.body); }).catch(() => undefined).finally(() => { window.clearTimeout(fallback); setDraftReady(true); });
    void detectCapabilities().then(setCapabilities);
    return () => { acceptDraft = false; window.clearTimeout(fallback); };
  }, []);
  useEffect(() => { if (!draftReady) return; const timer = window.setTimeout(() => void draftStore.save(createScriptDocument(text)), 500); return () => window.clearTimeout(timer); }, [draftReady, text]);
  useEffect(() => { const stored = localStorage.getItem("frameline-settings"); if (stored) window.setTimeout(() => { try { setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) }); } catch {} }, 0); }, []);
  useEffect(() => { localStorage.setItem("frameline-settings", JSON.stringify(settings)); }, [settings]);

  const update = <K extends keyof TeleprompterSettings>(key: K, value: TeleprompterSettings[K]) => setSettings((current) => ({ ...current, [key]: value }));
  const clear = async () => { setText(""); await draftStore.clear(); };
  const togglePlayback = async () => {
    const video = videoRef.current; if (!video) return;
    if (video.paused) { await video.play(); setPlaying(true); } else { video.pause(); setPlaying(false); }
  };

  return <main className="workspace shell">
    <header className="app-header"><Link className="wordmark" href="/">Frameline</Link><span className="privacy-pill"><LockKeyhole size={15}/> On-device</span></header>
    <section className="workspace-heading"><p className="eyebrow">Floating teleprompter</p><h1>Keep your eyes on the moment.</h1><p>Paste your words, shape the pace, then float them over your camera app.</p></section>

    {unsupported.length > 0 && <aside className="capability-alert" aria-labelledby="capability-title"><AlertCircle/><div><h2 id="capability-title">This browser needs attention</h2>{unsupported.map((item) => <p key={item.key}><strong>{item.label}:</strong> {item.recovery}</p>)}</div></aside>}

    <div className="workspace-grid">
      <section className="panel editor-panel" aria-labelledby="script-heading">
        <div className="panel-heading"><div><p className="step">01 · Script</p><h2 id="script-heading">What will you say?</h2></div><Button className="button-ghost" onClick={() => void clear()} disabled={!text}><Trash2 size={17}/> Clear</Button></div>
        <label className="sr-only" htmlFor="script">Your script</label>
        <textarea id="script" value={text} disabled={!draftReady} onChange={(event) => setText(event.target.value)} placeholder={draftReady ? "Paste or write your script here…" : "Loading your local draft…"} />
        <div className="script-meta"><span>{words} words</span><span>About {formatDuration(duration)}</span><span>Saved locally</span></div>
      </section>

      <section className="panel preview-panel" aria-labelledby="preview-heading">
        <div className="panel-heading"><div><p className="step">02 · Preview</p><h2 id="preview-heading">Reading window</h2></div><span className="live-dot">Live</span></div>
        <div className="preview" style={{ color: settings.textColor, backgroundColor: settings.backgroundColor, aspectRatio: settings.aspectRatio.replace(":", "/"), fontSize: `${Math.max(18, settings.fontSize * .43)}px`, lineHeight: settings.lineHeight, textAlign: settings.alignment, paddingInline: `${settings.horizontalPadding / 3}px` }}>
          {settings.showGuide && <><i className="guide left"/><i className="guide right"/></>}
          <p>{text || "Your words will appear here, close to the camera."}</p>
        </div>
      </section>
    </div>

    <section className="panel settings-panel" aria-labelledby="settings-heading"><div className="panel-heading"><div><p className="step">03 · Tune</p><h2 id="settings-heading">Make it yours</h2></div></div>
      <div className="settings-grid">
        <Range label="Reading speed" value={settings.wordsPerMinute} min={75} max={300} suffix=" wpm" onChange={(v) => update("wordsPerMinute", v)}/>
        <Range label="Text size" value={settings.fontSize} min={36} max={90} suffix=" px" onChange={(v) => update("fontSize", v)}/>
        <Range label="Line spacing" value={settings.lineHeight} min={1} max={1.8} step={.1} onChange={(v) => update("lineHeight", v)}/>
        <Range label="Start delay" value={settings.leadInSeconds} min={0} max={10} suffix=" sec" onChange={(v) => update("leadInSeconds", v)}/>
        <label className="control"><span>Window shape</span><select value={settings.aspectRatio} onChange={(e) => update("aspectRatio", e.target.value as TeleprompterSettings["aspectRatio"])}><option value="3:1">Wide · 3:1</option><option value="16:9">Video · 16:9</option><option value="4:3">Classic · 4:3</option></select></label>
        <label className="control"><span>Alignment</span><select value={settings.alignment} onChange={(e) => update("alignment", e.target.value as "left" | "center")}><option value="center">Centered</option><option value="left">Left</option></select></label>
        <label className="control color-control"><span>Text color</span><input type="color" value={settings.textColor} onChange={(e) => update("textColor", e.target.value)}/></label>
        <label className="control color-control"><span>Background</span><input type="color" value={settings.backgroundColor} onChange={(e) => update("backgroundColor", e.target.value)}/></label>
        <label className="switch"><input type="checkbox" checked={settings.showGuide} onChange={(e) => update("showGuide", e.target.checked)}/><span>Center guide</span></label>
        <label className="switch"><input type="checkbox" checked={settings.loop} onChange={(e) => update("loop", e.target.checked)}/><span>Loop attempts</span></label>
      </div>
    </section>

    <section className="action-dock" aria-live="polite">
      {state === "generating" ? <><div className="progress-copy"><strong>Preparing on this device…</strong><span>{progress}%</span><progress value={progress} max="100"/></div><Button className="button-secondary" onClick={cancel}>Cancel</Button></> : state === "ready" ? <><div className="ready-copy"><CheckCircle2/><div><strong>Your teleprompter is ready</strong><span>Switch apps after opening the floating window.</span></div></div><div className="action-buttons"><Button className="icon-button button-secondary" aria-label={playing ? "Pause" : "Play"} onClick={() => void togglePlayback()}>{playing ? <Pause/> : <Play/>}</Button><Button className="icon-button button-secondary" aria-label="Restart" onClick={() => { if (videoRef.current) videoRef.current.currentTime = 0; }}><RotateCcw/></Button><Button onClick={() => void enterPip(settings.wordsPerMinute)}><PictureInPicture2/> Open floating teleprompter</Button></div></> : <><div><strong>Ready when you are</strong><span className="dock-note"> No uploads. The prepared video stays in memory.</span></div><Button disabled={!text.trim() || unsupported.length > 0} onClick={() => prepare(text, settings)}>Prepare floating teleprompter</Button></>}
      {state === "failed" && <p className="error-text">{error} Try preparing it again.</p>}
    </section>
    <video ref={videoRef} className="session-video" playsInline loop={settings.loop} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}/>
  </main>;
}

function Range({ label, value, min, max, step = 1, suffix = "", onChange }: { label: string; value: number; min: number; max: number; step?: number; suffix?: string; onChange(value: number): void }) {
  return <label className="control range-control"><span>{label}<output>{value}{suffix}</output></span><input type="range" value={value} min={min} max={max} step={step} onChange={(e) => onChange(Number(e.target.value))}/></label>;
}
