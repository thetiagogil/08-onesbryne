import { ImageIcon } from "lucide-react";

import { cn } from "@/shared/utils/cn";

type ImagePlaceholderProps = {
  className?: string;
  label?: string;
};

export const ImagePlaceholder = ({
  className,
  label = "Image pending",
}: ImagePlaceholderProps) => {
  return (
    <div
      className={cn(
        "bg-surface tracking-eyebrow text-muted-foreground flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center text-[11px] uppercase",
        className,
      )}
    >
      <ImageIcon className="size-5 opacity-60" />
      <span>{label}</span>
    </div>
  );
};
