import type { ReactNode } from "react";
import Link from "next/link";

import { cn } from "@/shared/utils/cn";

type PublicMobileMenuLinkProps = {
  active: boolean;
  children: ReactNode;
  className?: string;
  href: string;
};

export const PublicMobileMenuLink = ({
  active,
  children,
  className,
  href,
}: PublicMobileMenuLinkProps) => {
  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={cn(
        "tracking-eyebrow link-underline w-fit text-sm uppercase transition-colors",
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
};
