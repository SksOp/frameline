export interface TextMeasurer { measureText(text: string): { width: number } }

export function wrapText(text: string, maxWidth: number, context: TextMeasurer): string[] {
  const paragraphs = text.split("\n");
  const lines: string[] = [];
  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) { lines.push(""); continue; }
    const words = paragraph.trim().split(/\s+/u);
    let line = "";
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (!line || context.measureText(candidate).width <= maxWidth) {
        line = candidate;
      } else {
        lines.push(line);
        line = word;
      }
    }
    if (line) lines.push(line);
  }
  return lines;
}

export function visibleLineRange(scrollY: number, viewportHeight: number, lineHeight: number, lineCount: number) {
  return {
    first: Math.max(0, Math.floor(scrollY / lineHeight) - 1),
    last: Math.min(lineCount - 1, Math.ceil((scrollY + viewportHeight) / lineHeight) + 1),
  };
}
