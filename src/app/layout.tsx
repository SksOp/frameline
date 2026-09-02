import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/newsreader";
import "@fontsource-variable/roboto-mono";
import "./globals.css";

const origin = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  metadataBase: new URL(origin ?? "http://localhost:4444"),
  title: { default: "Frameline — a private floating teleprompter", template: "%s · Frameline" },
  description: "Prepare a floating teleprompter privately on your Android phone. No account, uploads, or downloads.",
  alternates: origin ? { canonical: "/" } : undefined,
  openGraph: { title: "Frameline", description: "Your words, close to the camera.", type: "website", images: ["/opengraph-image"] },
  twitter: { card: "summary_large_image", title: "Frameline", description: "A private, on-device floating teleprompter.", images: ["/twitter-image"] },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#15130f" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
