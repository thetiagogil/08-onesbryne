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

export const SiteShell = ({ children, currentUser }: SiteShellProps) => {
  const isAdmin = currentUser?.profile.appRole === "admin";

  return (
    <div className="bg-background text-foreground flex min-h-dvh flex-col">
      <header className="border-hairline bg-background/80 relative sticky top-0 z-40 border-b backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-400 items-center justify-between px-4 sm:px-6 lg:px-10">
          <nav className="flex flex-1 items-center gap-5 sm:gap-8">
            <PublicMobileMenu isAdmin={isAdmin} />
            <PublicNavLinks />
          </nav>

          <AppLogo className="sm:tracking-wordmark text-lg tracking-[0.28em] sm:text-xl" />

          <nav className="flex flex-1 items-center justify-end gap-3 sm:gap-5">
            {currentUser ? (
              <>
                {isAdmin ? (
                  <Link
                    aria-label="Open admin"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    href="/admin"
                  >
                    <ShieldCheck className="size-4" />
                  </Link>
                ) : null}
                <Link
                  aria-label="Favourites"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  href="/favourites"
                >
                  <Heart className="size-4" />
                </Link>
                <Link
                  aria-label="Account"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  href="/account"
                >
                  <UserRound className="size-4" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  aria-label="Log in"
                  className="text-muted-foreground hover:text-foreground transition-colors sm:hidden"
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

      <footer className="border-hairline border-t">
        <div className="mx-auto flex max-w-400 flex-col items-start justify-between gap-6 px-6 py-12 md:flex-row md:items-end lg:px-10">
          <div>
            <div className="font-display tracking-wordmark text-lg uppercase">
              {APP_NAME}
            </div>
            <p className="text-muted-foreground mt-2 max-w-sm text-xs">
              A curated catalog of selected pieces. Each item is one of one.
            </p>
          </div>
          <div className="tracking-eyebrow text-muted-foreground text-[11px] uppercase">
            &copy; {new Date().getFullYear()} &mdash; All pieces unique
          </div>
        </div>
      </footer>
    </div>
  );
};
