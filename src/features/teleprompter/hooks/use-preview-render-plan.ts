"use client";

import { useEffect, useRef, useState } from "react";
import { buildRenderPlan, renderFont, scaleRenderPlan, type RenderPlan, type ScaledRenderPlan } from "../rendering/plan";
import type { TeleprompterSettings } from "../types";

export interface PreviewRenderPlan {
  plan: RenderPlan;
  scaled: ScaledRenderPlan;
}

export function usePreviewRenderPlan(text: string, settings: TeleprompterSettings) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<PreviewRenderPlan | null>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    let active = true;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return;
    context.font = renderFont(settings.fontSize);
    let plan = buildRenderPlan(text, settings, context);
    const publish = (width = viewport.getBoundingClientRect().width) => {
      if (!active || width <= 0) return;
      setLayout({ plan, scaled: scaleRenderPlan(plan, width) });
    };
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver((entries) => publish(entries[0]?.contentRect.width));
    observer?.observe(viewport);
    const frame = requestAnimationFrame(() => publish());
    void document.fonts?.ready.then(() => {
      if (!active) return;
      context.font = renderFont(settings.fontSize);
      plan = buildRenderPlan(text, settings, context);
      publish();
    });
    return () => { active = false; cancelAnimationFrame(frame); observer?.disconnect(); };
  }, [settings, text]);

  return { viewportRef, layout };
}
