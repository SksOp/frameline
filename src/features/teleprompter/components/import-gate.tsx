"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";
import { draftStore } from "@/lib/client/draft-store";
import { useMediaQuery } from "../hooks/use-media-query";
import { saveImportedDraft } from "../hooks/use-draft-persistence";
import { persistSettings, sanitizeSettings } from "../hooks/use-settings-persistence";
import { decodeShareParamToJson, decodeShareParamToText } from "@/lib/scripts/share-link";

type ImportGateProps = {
  scriptParam: string | null;
  tuneParam: string | null;
};

type SavedScriptState =
  | { status: "idle" | "loading" | "error"; text: "" }
  | { status: "loaded"; text: string };

const IDLE_SAVED_SCRIPT: SavedScriptState = { status: "idle", text: "" };

const surfaceClass = "flex flex-col gap-0 overflow-hidden bg-surface-elevated p-0 shadow-(--shadow-lg)";
const headerClass = "border-b border-divider bg-surface-strong px-[22px] py-4 max-[480px]:px-[18px]";
const bodyClass = "flex flex-col gap-3 overflow-auto px-[22px] py-[18px] max-[480px]:px-[18px]";
const footerClass =
  "mx-0 mb-0 flex flex-col-reverse gap-2 border-t border-divider bg-surface-strong px-[22px] py-3.5 pb-[calc(14px+env(safe-area-inset-bottom))] sm:flex-row sm:justify-end max-[480px]:px-[18px]";
const linkButtonClass = "font-bold text-warning underline underline-offset-2 hover:text-foreground";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function ImportGate({ scriptParam, tuneParam }: ImportGateProps) {
  const router = useRouter();
  const phone = useMediaQuery("(max-width: 760px)");
  const footerButtonClass = phone ? "min-h-11 w-full" : "h-9 px-3.5 text-[0.8rem]";
  const [step, setStep] = useState<"confirm" | "saved-preview">("confirm");
  const [pending, setPending] = useState(false);
  const [savedScript, setSavedScript] = useState<SavedScriptState>(IDLE_SAVED_SCRIPT);

  const decodedScript = useMemo(
    () => (scriptParam ? decodeShareParamToText(scriptParam) : null),
    [scriptParam],
  );
  const decodedSettings = useMemo(() => {
    if (!tuneParam) return null;
    const parsed = decodeShareParamToJson(tuneParam);
    return isRecord(parsed) ? sanitizeSettings(parsed) : null;
  }, [tuneParam]);

  const goToApp = () => router.replace("/teleprompter/app");

  const handleOpen = async () => {
    if (!decodedScript || pending) return;
    setPending(true);
    await saveImportedDraft(decodedScript);
    if (decodedSettings) persistSettings(window.localStorage, decodedSettings);
    goToApp();
  };

  const handlePreviewSaved = () => {
    setStep("saved-preview");
    if (savedScript.status !== "idle") return;
    setSavedScript({ status: "loading", text: "" });
    void draftStore.load()
      .then((document) => setSavedScript({ status: "loaded", text: document.body }))
      .catch(() => setSavedScript({ status: "error", text: "" }));
  };

  if (!decodedScript) {
    return (
      <main className="grid min-h-dvh place-items-center bg-surface px-6 py-10">
        <div className="flex w-full max-w-md flex-col gap-4">
          <Alert variant="destructive">
            <AlertTriangle />
            <AlertTitle>This link can&apos;t be opened</AlertTitle>
            <AlertDescription>
              The shared script link is missing or could not be read. Ask for a new link, or open Teleprompter
              with your saved script instead.
            </AlertDescription>
          </Alert>
          <Button onClick={goToApp} className="min-h-11">
            Go to Teleprompter
          </Button>
        </div>
      </main>
    );
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) goToApp();
  };

  const title = step === "confirm" ? "Open shared script?" : "Your saved script";
  const body = step === "confirm" ? (
    <ConfirmBody
      decodedScript={decodedScript}
      hasTuneOverride={decodedSettings !== null}
      onPreviewSaved={handlePreviewSaved}
    />
  ) : (
    <SavedScriptBody saved={savedScript} />
  );
  const footer = step === "confirm" ? (
    <>
      <Button variant="ghost" onClick={goToApp} className={footerButtonClass} disabled={pending}>
        Don&apos;t open
      </Button>
      <Button onClick={() => void handleOpen()} className={footerButtonClass} disabled={pending}>
        Open script
      </Button>
    </>
  ) : (
    <>
      <Button variant="ghost" onClick={() => setStep("confirm")} className={footerButtonClass} disabled={pending}>
        Back
      </Button>
      <Button onClick={() => void handleOpen()} className={footerButtonClass} disabled={pending}>
        Open script
      </Button>
    </>
  );
  const description = step === "confirm"
    ? "Choose whether to open the script from this link or leave your saved script alone."
    : "The script currently saved on this device, unchanged.";

  if (phone) {
    return (
      <Drawer open onOpenChange={handleOpenChange} showSwipeHandle>
        <DrawerContent className={`${surfaceClass} max-h-[88dvh] w-full rounded-t-xl border-x-0 border-b-0`}>
          <DrawerHeader className={headerClass}>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription className="sr-only">{description}</DrawerDescription>
          </DrawerHeader>
          <div className={bodyClass}>{body}</div>
          <DrawerFooter className={footerClass}>{footer}</DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent className={`${surfaceClass} w-[min(560px,calc(100%-40px))] max-w-[560px] rounded-xl`}>
        <DialogHeader className={headerClass}>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="sr-only">{description}</DialogDescription>
        </DialogHeader>
        <div className={bodyClass}>{body}</div>
        <DialogFooter className={footerClass}>{footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ConfirmBody({
  decodedScript,
  hasTuneOverride,
  onPreviewSaved,
}: {
  decodedScript: string;
  hasTuneOverride: boolean;
  onPreviewSaved(): void;
}) {
  const words = decodedScript.split(/\s+/u).filter(Boolean).length;
  return (
    <Alert variant="warning">
      <AlertTriangle />
      <AlertTitle>Opening replaces what&apos;s saved on this device</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>
          This link&apos;s script ({words} words){hasTuneOverride ? " and its reading settings" : ""} will overwrite
          what&apos;s currently saved here. This can&apos;t be undone.
        </p>
        <button type="button" onClick={onPreviewSaved} className={`${linkButtonClass} self-start`}>
          Preview saved script
        </button>
      </AlertDescription>
    </Alert>
  );
}

function SavedScriptBody({ saved }: { saved: SavedScriptState }) {
  if (saved.status === "loading" || saved.status === "idle") {
    return <p className="font-mono text-[0.68rem] font-bold text-text-secondary">Loading your saved script…</p>;
  }
  if (saved.status === "error") {
    return (
      <Alert variant="destructive">
        <AlertTriangle />
        <AlertTitle>Couldn&apos;t load your saved script</AlertTitle>
        <AlertDescription>Try again, or open the link&apos;s script directly.</AlertDescription>
      </Alert>
    );
  }
  if (!saved.text) {
    return <p className="font-mono text-[0.68rem] font-bold text-text-secondary">No script is saved on this device yet.</p>;
  }
  return (
    <Textarea
      readOnly
      value={saved.text}
      aria-label="Currently saved script"
      className="h-[45dvh] min-h-[220px] resize-none bg-surface font-mono text-[0.85rem] leading-[1.6]"
    />
  );
}
