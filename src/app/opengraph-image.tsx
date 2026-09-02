import { ImageResponse } from "next/og";
import { SocialCard, socialAlt, socialSize } from "./social-card";
export const alt = socialAlt; export const size = socialSize; export const contentType = "image/png";
export default function Image() { return new ImageResponse(<SocialCard/>, size); }
