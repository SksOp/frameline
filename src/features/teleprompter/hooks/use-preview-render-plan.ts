"use client";

import { useEffect, useRef, useState } from "react";
import { buildRenderPlan, renderFont, scaleRenderPlan, type RenderPlan, type ScaledRenderPlan } from "../rendering/plan";
import type { TeleprompterSettings } from "../types";

export interface PreviewRenderPlan {
  plan: RenderPlan;
  scaled: ScaledRenderPlan;
}

export function usePreviewRenderPlan(
  text: string,
  settings: TeleprompterSettings,
  fillViewport = false,
) {
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
    const publish = (
      width = viewport.getBoundingClientRect().width,
      height = viewport.getBoundingClientRect().height,
    ) => {
      if (!active || width <= 0) return;
      const scaled = scaleRenderPlan(plan, width);
      setLayout({
        plan,
        scaled: fillViewport && height > 0
          ? { ...scaled, startY: height }
          : scaled,
      });
    };
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver((entries) => {
      const bounds = entries[0]?.contentRect;
      publish(bounds?.width, bounds?.height);
    });
    observer?.observe(viewport);
    const frame = requestAnimationFrame(() => publish());
    void document.fonts?.ready.then(() => {
      if (!active) return;
      context.font = renderFont(settings.fontSize);
      plan = buildRenderPlan(text, settings, context);
      publish();
    });
    return () => { active = false; cancelAnimationFrame(frame); observer?.disconnect(); };
  }, [fillViewport, settings, text]);

  return { viewportRef, layout };
}
