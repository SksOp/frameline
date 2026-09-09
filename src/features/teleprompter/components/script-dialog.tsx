'use client';

import { Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Textarea } from '@/components/ui/textarea';
import { useMediaQuery } from '../hooks/use-media-query';
import { ToolButton } from './tool-button';

type ScriptDialogProps = {
  open: boolean;
  text: string;
  draftReady: boolean;
  persistenceError: string | null;
  onClose(): void;
  onClear(): Promise<void>;
  onTextChange(text: string): void;
};

const surfaceClass =
  'flex flex-col gap-0 overflow-hidden bg-surface-elevated p-0 shadow-(--shadow-lg)';
const headerClass =
  'flex-row items-center justify-between border-b border-divider px-5 py-3.5';

export function ScriptDialog({
  open,
  text,
  draftReady,
  persistenceError,
  onClose,
  onClear,
  onTextChange,
}: ScriptDialogProps) {
  const phone = useMediaQuery('(max-width: 760px)');
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) onClose();
  };
  const body = (
    <ScriptDialogBody
      text={text}
      draftReady={draftReady}
      persistenceError={persistenceError}
      onClear={onClear}
      onTextChange={onTextChange}
    />
  );

  if (phone) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange} showSwipeHandle>
        <DrawerContent className={`${surfaceClass} h-[min(88dvh,760px)] w-full rounded-t-xl border-x-0 border-b-0`}>
          <DrawerHeader className={headerClass}>
            <DrawerTitle>Edit script</DrawerTitle>
            <DrawerDescription className="sr-only">Edit the words shown in the teleprompter.</DrawerDescription>
            <ToolButton iconOnly aria-label="Close script editor" onClick={onClose}><X /></ToolButton>
          </DrawerHeader>
          {body}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={`${surfaceClass} h-[min(78dvh,720px)] w-[min(760px,calc(100%-40px))] max-w-[760px] rounded-xl`} showCloseButton={false}>
        <DialogHeader className={headerClass}>
          <DialogTitle>Edit script</DialogTitle>
          <DialogDescription className="sr-only">Edit the words shown in the teleprompter.</DialogDescription>
          <ToolButton iconOnly aria-label="Close script editor" onClick={onClose}><X /></ToolButton>
        </DialogHeader>
        {body}
      </DialogContent>
    </Dialog>
  );
}

function ScriptDialogBody({
  text,
  draftReady,
  persistenceError,
  onClear,
  onTextChange,
}: Omit<ScriptDialogProps, 'open' | 'onClose'>) {
  return (
    <div className="flex min-h-0 flex-1 flex-col p-3.5 sm:p-5">
      <label className="sr-only" htmlFor="script-dialog-input">Your script</label>
      <Textarea
        className="min-h-0 flex-1 resize-none border-0 bg-transparent px-1 py-1 font-mono text-[0.95rem] leading-[1.7] shadow-none placeholder:text-text-subtle hover:bg-transparent focus-visible:ring-0 md:text-[0.95rem]"
        id="script-dialog-input"
        value={text}
        disabled={!draftReady}
        onChange={(event) => onTextChange(event.target.value)}
        placeholder={draftReady ? 'Paste or write your script…' : 'Loading your draft…'}
      />
      <div className="mt-3 flex min-h-11 items-center justify-between gap-3 border-t border-divider pt-3">
        {persistenceError ? <p className="m-0 text-xs font-semibold text-danger">{persistenceError}</p> : <span />}
        <Button variant="ghost" className="min-h-11 shrink-0 text-danger hover:bg-danger-surface hover:text-danger" disabled={!text} onClick={() => void onClear()}>
          <Trash2 /> Clear script
        </Button>
      </div>
    </div>
  );
}
