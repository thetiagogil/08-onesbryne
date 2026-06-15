import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/shared/utils/cn";

type ActionLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  children: ReactNode;
  icon?: ReactNode;
};

export function ActionLink({
  children,
  className,
  icon,
  ...props
}: ActionLinkProps) {
  return (
    <Link
      className={cn(
        "flex min-h-13 items-center gap-2 border border-hairline px-6 py-4 text-[11px] tracking-eyebrow uppercase transition-colors hover:border-accent hover:text-accent focus-visible:border-accent focus-visible:outline-none",
        className,
      )}
      {...props}
    >
      {icon ? <span className="[&_svg]:size-3.5">{icon}</span> : null}
      {children}
    </Link>
  );
}
