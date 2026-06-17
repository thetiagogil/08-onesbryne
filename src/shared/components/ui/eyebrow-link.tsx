import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/shared/utils/cn";

type EyebrowLinkProps = ComponentProps<typeof Link>;

export const EyebrowLink = ({ className, ...props }: EyebrowLinkProps) => {
  return (
    <Link
      className={cn(
        "tracking-eyebrow text-muted-foreground link-underline text-[11px] uppercase",
        className,
      )}
      {...props}
    />
  );
};
