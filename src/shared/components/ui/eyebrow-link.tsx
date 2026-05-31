import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/shared/utils/cn";

type EyebrowLinkProps = ComponentProps<typeof Link>;

export function EyebrowLink({ className, ...props }: EyebrowLinkProps) {
  return (
    <Link
      className={cn(
        "text-[11px] tracking-eyebrow text-muted-foreground uppercase link-underline",
        className,
      )}
      {...props}
    />
  );
}
