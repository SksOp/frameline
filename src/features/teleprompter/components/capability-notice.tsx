import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Capability } from "@/lib/client/capabilities";

export function CapabilityNotice({ unsupported }: { unsupported: Capability[] }) {
  if (unsupported.length === 0) return null;
  return <Alert className="capability-alert" aria-labelledby="capability-title">
    <AlertCircle />
    <AlertTitle id="capability-title">Some features are unavailable</AlertTitle>
    <AlertDescription>
      <ul>{unsupported.map((item) => <li key={item.key}><strong>{item.label}:</strong> {item.recovery}</li>)}</ul>
    </AlertDescription>
  </Alert>;
}
