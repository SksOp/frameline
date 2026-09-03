import { ImageResponse } from "next/og";
import { SocialCard, socialSize } from "../social-card";

export function GET() {
  return new ImageResponse(<SocialCard />, socialSize);
}
