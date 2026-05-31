"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  isNavLinkActive,
  publicNavLinks,
} from "@/shared/constants/navigation";
import { cn } from "@/shared/utils/cn";

export function PublicNavLinks() {
  const pathname = usePathname();

  return (
    <>
      {publicNavLinks.map((link) => {
        const active = isNavLinkActive(pathname, link.href);

        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={cn(
              "hidden text-[11px] tracking-eyebrow uppercase transition-colors link-underline md:inline",
              active
                ? "text-foreground [background-size:100%_1px]"
                : "text-muted-foreground hover:text-foreground",
            )}
            href={link.href}
            key={link.href}
          >
            {link.label}
          </Link>
        );
      })}
    </>
  );
}
