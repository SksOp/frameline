import { renderFont, type RenderPlan } from "./plan";

export function visibleLineRangeAtTop(top: number, viewportHeight: number, lineHeight: number, lineCount: number) {
  return {
    first: Math.max(0, Math.floor(-top / lineHeight) - 1),
    last: Math.min(lineCount - 1, Math.ceil((viewportHeight - top) / lineHeight) + 1),
  };
}

/** Paints the same HTML-canvas frame sequence proven by the WebCodecs concept. */
export function paintFrame(context: CanvasRenderingContext2D, plan: RenderPlan, frameIndex: number) {
  const { width, height, settings } = plan;
  context.fillStyle = settings.backgroundColor;
  context.fillRect(0, 0, width, height);

  const activeFrame = Math.max(0, frameIndex - plan.leadInFrames);
  const activeFrames = Math.max(1, plan.frameCount - plan.leadInFrames - 1);
  const progress = activeFrame / activeFrames;
  const firstY = height + plan.lineHeightPx / 2 - progress * plan.travel;
  const range = visibleLineRangeAtTop(firstY, height, plan.lineHeightPx, plan.lines.length);

  context.fillStyle = settings.textColor;
  context.font = renderFont(settings.fontSize);
  context.textAlign = settings.alignment;
  context.textBaseline = "middle";
  for (let lineIndex = range.first; lineIndex <= range.last; lineIndex++) {
    const x = settings.alignment === "center" ? width / 2 : settings.horizontalPadding;
    const y = firstY + lineIndex * plan.lineHeightPx;
    context.fillText(plan.lines[lineIndex] ?? "", x, y, width - settings.horizontalPadding * 2);
  }

  if (settings.showGuide) {
    context.fillStyle = "#d5a94e";
    context.fillRect(18, height / 2 - 1, 24, 2);
    context.fillRect(width - 42, height / 2 - 1, 24, 2);
  }
  if (settings.showProgress) {
    context.fillStyle = "rgba(255, 255, 255, .16)";
    context.fillRect(0, height - 4, width, 4);
    context.fillStyle = "#55b67a";
    context.fillRect(0, height - 4, width * progress, 4);
  }
}
