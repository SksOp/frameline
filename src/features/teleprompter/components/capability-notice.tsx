import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Capability } from "@/lib/client/capabilities";

export function CapabilityNotice({ unsupported }: { unsupported: Capability[] }) {
  if (unsupported.length === 0) return null;
  return <Alert variant="warning" className="mt-[18px] items-start gap-x-[11px] gap-y-[3px] rounded-md border-warning px-4 py-[13px]" aria-labelledby="capability-title">
    <AlertCircle className="size-5" />
    <AlertTitle className="text-[0.78rem] font-black" id="capability-title">Some features are unavailable</AlertTitle>
    <AlertDescription className="text-[0.72rem] leading-[1.45]">
      <ul>{unsupported.map((item) => <li key={item.key}><strong>{item.label}:</strong> {item.recovery}</li>)}</ul>
    </AlertDescription>
  </Alert>;
}
