import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/newsreader";
import "@fontsource-variable/roboto-mono";
import { getSiteOrigin } from "@/lib/site-origin";
import { socialAlt, socialSize } from "./social-card";
import "./globals.css";

const origin = getSiteOrigin();
const socialImage = {
  url: "/opengraph-image",
  width: socialSize.width,
  height: socialSize.height,
  alt: socialAlt,
  type: "image/png",
};

export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: { default: "Frameline — Talk like you mean it", template: "%s · Frameline" },
  description: "Prepare a floating teleprompter privately on your Android phone. On-device processing, no account, no uploads.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Frameline — Talk like you mean it",
    description: "Private on-device floating teleprompter for Android Chrome.",
    type: "website",
    url: "/",
    siteName: "Frameline",
    locale: "en_US",
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Frameline",
    description: "Private on-device floating teleprompter for Android Chrome.",
    images: [socialImage],
  },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#0a0a0a" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
