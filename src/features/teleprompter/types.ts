export type AspectRatio = "3:1" | "16:9" | "4:3";
export type TextAlignment = "left" | "center";

export const HORIZONTAL_PADDING_BOUNDS = Object.freeze({ min: 16, max: 120 });

export interface TeleprompterSettings {
  fontSize: number;
  lineHeight: number;
  textColor: string;
  backgroundColor: string;
  aspectRatio: AspectRatio;
  horizontalPadding: number;
  showGuide: boolean;
  showProgress: boolean;
  alignment: TextAlignment;
  wordsPerMinute: number;
  leadInSeconds: number;
  loop: boolean;
}

export const DEFAULT_SETTINGS: TeleprompterSettings = {
  fontSize: 42,
  lineHeight: 1.5,
  textColor: "#fffaf0",
  backgroundColor: "#15130f",
  aspectRatio: "3:1",
  horizontalPadding: 56,
  showGuide: true,
  showProgress: true,
  alignment: "center",
  wordsPerMinute: 120,
  leadInSeconds: 0,
  loop: false,
};
