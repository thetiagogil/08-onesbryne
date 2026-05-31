import type { ReactNode } from "react";
import Link from "next/link";

import { cn } from "@/shared/utils/cn";

type PublicMobileMenuLinkProps = {
  active: boolean;
  children: ReactNode;
  className?: string;
  href: string;
};

export function PublicMobileMenuLink({
  active,
  children,
  className,
  href,
}: PublicMobileMenuLinkProps) {
  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={cn(
        "w-fit text-sm tracking-eyebrow uppercase transition-colors link-underline",
        active
          ? "text-foreground [background-size:100%_1px]"
          : "text-muted-foreground hover:text-foreground",
        className,
      )}
      href={href}
    >
      {children}
    </Link>
  );
}
