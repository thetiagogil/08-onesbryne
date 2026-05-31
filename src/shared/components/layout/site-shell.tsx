import { Heart, ShieldCheck, UserRound } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { AppLogo } from "@/shared/components/layout/app-logo";
import { PublicMobileMenu } from "@/shared/components/layout/public-mobile-menu";
import { PublicNavLinks } from "@/shared/components/layout/public-nav-links";
import { Button } from "@/shared/components/ui/button";
import { APP_NAME } from "@/shared/constants/app";
import type { CurrentUser } from "@/shared/types";

type SiteShellProps = {
  children: ReactNode;
  currentUser: CurrentUser | null;
};

export function SiteShell({ children, currentUser }: SiteShellProps) {
  const isAdmin = currentUser?.profile.appRole === "admin";

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="relative sticky top-0 z-40 border-b border-hairline bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-400 items-center justify-between px-4 sm:px-6 lg:px-10">
          <nav className="flex flex-1 items-center gap-5 sm:gap-8">
            <PublicMobileMenu isAdmin={isAdmin} />
            <PublicNavLinks />
          </nav>

          <AppLogo className="text-lg tracking-[0.28em] sm:text-xl sm:tracking-wordmark" />

          <nav className="flex flex-1 items-center justify-end gap-3 sm:gap-5">
            {currentUser ? (
              <>
                {isAdmin ? (
                  <Link
                    aria-label="Open admin"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                    href="/admin"
                  >
                    <ShieldCheck className="size-4" />
                  </Link>
                ) : null}
                <Link
                  aria-label="Favourites"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  href="/favourites"
                >
                  <Heart className="size-4" />
                </Link>
                <Link
                  aria-label="Account"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  href="/account"
                >
                  <UserRound className="size-4" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  aria-label="Log in"
                  className="text-muted-foreground transition-colors hover:text-foreground sm:hidden"
                  href="/auth"
                >
                  <UserRound className="size-4" />
                </Link>
                <Button
                  asChild
                  className="hidden sm:inline-flex"
                  size="sm"
                  variant="ghost"
                >
                  <Link href="/auth">Log in</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-hairline">
        <div className="mx-auto flex max-w-400 flex-col items-start justify-between gap-6 px-6 py-12 md:flex-row md:items-end lg:px-10">
          <div>
            <div className="font-display text-lg tracking-wordmark uppercase">
              {APP_NAME}
            </div>
            <p className="mt-2 max-w-sm text-xs text-muted-foreground">
              A curated catalog of selected pieces. Each item is one of one.
            </p>
          </div>
          <div className="text-[11px] tracking-eyebrow text-muted-foreground uppercase">
            &copy; {new Date().getFullYear()} &mdash; All pieces unique
          </div>
        </div>
      </footer>
    </div>
  );
}
