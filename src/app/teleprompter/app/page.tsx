import type { Metadata } from "next";
import { TeleprompterApp } from "@/features/teleprompter/teleprompter-app";

const title = "Open Teleprompter";
const description = "Write and prepare your private, on-device teleprompter in Android Chrome.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/teleprompter/app" },
  robots: { index: false, follow: false },
  openGraph: {
    title: `${title} · Frameline`,
    description,
    type: "website",
    url: "/teleprompter/app",
    siteName: "Frameline",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Frameline creator studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} · Frameline`,
    description,
    images: ["/opengraph-image"],
  },
};

export default function TeleprompterAppPage() {
  return <TeleprompterApp />;
}
