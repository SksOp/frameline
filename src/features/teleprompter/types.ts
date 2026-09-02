export type AspectRatio = "3:1" | "16:9" | "4:3";
export type TextAlignment = "left" | "center";

export interface TeleprompterSettings {
  fontSize: number;
  lineHeight: number;
  textColor: string;
  backgroundColor: string;
  aspectRatio: AspectRatio;
  horizontalPadding: number;
  showGuide: boolean;
  alignment: TextAlignment;
  wordsPerMinute: number;
  leadInSeconds: number;
  loop: boolean;
}

export const DEFAULT_SETTINGS: TeleprompterSettings = {
  fontSize: 58,
  lineHeight: 1.3,
  textColor: "#fffaf0",
  backgroundColor: "#15130f",
  aspectRatio: "3:1",
  horizontalPadding: 56,
  showGuide: true,
  alignment: "center",
  wordsPerMinute: 150,
  leadInSeconds: 3,
  loop: false,
};
