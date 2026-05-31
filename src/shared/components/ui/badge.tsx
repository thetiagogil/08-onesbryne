import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/shared/utils/cn";

export type BadgeTone = "accent" | "default" | "muted" | "danger";

const badgeTones: Record<BadgeTone, string> = {
  accent: "bg-accent/20 text-accent",
  danger: "bg-destructive/15 text-destructive",
  default: "bg-foreground text-background",
  muted: "bg-surface-elevated text-muted-foreground",
};

type BadgeProps = ComponentPropsWithoutRef<"span"> & {
  tone?: BadgeTone;
};

export function Badge({ className, tone = "muted", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 text-[10px] tracking-eyebrow uppercase",
        badgeTones[tone],
        className,
      )}
      {...props}
    />
  );
}
