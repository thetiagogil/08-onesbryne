import Link from "next/link";

import {
  adminNavLinks,
  protectedNavLinks,
} from "@/shared/constants/navigation";
import { cn } from "@/shared/utils/cn";

type ProtectedNavLinksProps = {
  isAdmin: boolean;
  pathname: string;
};

export function ProtectedNavLinks({
  isAdmin,
  pathname,
}: ProtectedNavLinksProps) {
  const links = isAdmin
    ? [...protectedNavLinks, ...adminNavLinks]
    : protectedNavLinks;

  return (
    <>
      {links.map((link) => {
        const active =
          pathname === link.href || pathname.startsWith(`${link.href}/`);

        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative text-[11px] tracking-eyebrow uppercase transition-colors",
              active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
            href={link.href}
            key={link.href}
          >
            {link.label}
            {active ? (
              <span className="absolute inset-x-0 -bottom-2 h-px bg-accent" />
            ) : null}
          </Link>
        );
      })}
    </>
  );
}
