"use client";

import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

import { PublicMobileMenuLink } from "@/shared/components/layout/public-mobile-menu-link";
import { isNavLinkActive, publicNavLinks } from "@/shared/constants/navigation";

type PublicMobileMenuProps = {
  isAdmin: boolean;
};

export const PublicMobileMenu = ({ isAdmin }: PublicMobileMenuProps) => {
  const pathname = usePathname();

  return (
    <details className="group md:hidden">
      <summary
        aria-label="Menu"
        className="text-foreground hover:text-accent flex cursor-pointer list-none transition-colors [&::-webkit-details-marker]:hidden"
      >
        <Menu className="size-4 group-open:hidden" />
        <X className="hidden size-4 group-open:block" />
      </summary>

      <div className="border-hairline bg-background absolute inset-x-0 top-16 border-t px-6 py-4">
        <nav className="flex flex-col gap-4">
          {publicNavLinks.map((link) => (
            <PublicMobileMenuLink
              active={isNavLinkActive(pathname, link.href)}
              href={link.href}
              key={link.href}
            >
              {link.label}
            </PublicMobileMenuLink>
          ))}
          {isAdmin ? (
            <PublicMobileMenuLink
              active={isNavLinkActive(pathname, "/admin")}
              className="text-accent"
              href="/admin"
            >
              Admin
            </PublicMobileMenuLink>
          ) : null}
        </nav>
      </div>
    </details>
  );
};
