import { ImageIcon } from "lucide-react";

import { cn } from "@/shared/utils/cn";

type ImagePlaceholderProps = {
  className?: string;
  label?: string;
};

export function ImagePlaceholder({
  className,
  label = "Image pending",
}: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-3 bg-surface px-6 text-center text-[11px] tracking-eyebrow text-muted-foreground uppercase",
        className,
      )}
    >
      <ImageIcon className="size-5 opacity-60" />
      <span>{label}</span>
    </div>
  );
}
