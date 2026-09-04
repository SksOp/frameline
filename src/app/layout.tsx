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
  title: { default: "Frameline — Focused creator tools", template: "%s · Frameline" },
  description: "Focused creator tools with private, immediate, client-side workflows where practical and a free path to start.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Frameline — Focused creator tools",
    description: "Make the thing, skip the setup. Private, immediate creator tools with a free path to start.",
    type: "website",
    url: "/",
    siteName: "Frameline",
    locale: "en_US",
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Frameline — Focused creator tools",
    description: "Make the thing, skip the setup. Private, immediate creator tools with a free path to start.",
    images: [socialImage],
  },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#f4ead8" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
