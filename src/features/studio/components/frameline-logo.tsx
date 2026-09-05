import Image from "next/image";
import { cn } from "cn";

interface FramelineMarkProps {
  className?: string;
  size?: number;
}

export function FramelineMark({ className, size = 40 }: FramelineMarkProps) {
  return (
    <Image
      alt=""
      aria-hidden="true"
      className={cn("block shrink-0 object-contain", className)}
      height={size}
      src="/frameline-logo.svg"
      width={size}
    />
  );
}

export function FramelineLogo() {
  return (
    <span className="inline-flex items-center gap-2">
      <FramelineMark className="size-10" />
      <span className="text-xl leading-none font-bold tracking-[-0.04em] text-foreground">
        Frameline
      </span>
    </span>
  );
}
