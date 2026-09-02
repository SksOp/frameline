import type { Metadata } from "next";
import { TeleprompterApp } from "@/features/teleprompter/teleprompter-app";

export const metadata: Metadata = { title: "Teleprompter", robots: { index: false, follow: false } };
export default function TeleprompterPage() { return <TeleprompterApp/>; }
