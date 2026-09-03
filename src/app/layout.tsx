import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/newsreader";
import "@fontsource-variable/roboto-mono";
import "./globals.css";

const origin = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  metadataBase: new URL(origin ?? "http://localhost:4444"),
  title: { default: "Frameline — Talk like you mean it", template: "%s · Frameline" },
  description: "Prepare a floating teleprompter privately on your Android phone. On-device processing, no account, no uploads.",
  alternates: origin ? { canonical: "/" } : undefined,
  openGraph: { title: "Frameline — Talk like you mean it", description: "Private on-device floating teleprompter for Android Chrome.", type: "website", images: ["/opengraph-image"] },
  twitter: { card: "summary_large_image", title: "Frameline", description: "Private on-device floating teleprompter for Android Chrome.", images: ["/twitter-image"] },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#0a0a0a" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
