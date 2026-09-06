import type { Metadata } from "next";
import { ImportGate } from "@/features/teleprompter/components/import-gate";

const title = "Open shared script";
const description = "Review a shared Teleprompter script before it replaces what's saved on this device.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/teleprompter/app/open" },
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function firstString(value: string | string[] | undefined): string | null {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  return null;
}

export default async function OpenSharedScriptPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  return (
    <ImportGate scriptParam={firstString(params.script)} tuneParam={firstString(params.tune)} />
  );
}
