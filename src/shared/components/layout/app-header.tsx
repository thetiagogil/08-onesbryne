import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { AppLogo } from "@/shared/components/layout/app-logo";
import { cn } from "@/shared/utils/cn";

type AppHeaderProps = ComponentPropsWithoutRef<"header"> & {
  actions?: ReactNode;
  center?: ReactNode;
  innerClassName?: string;
  leading?: ReactNode;
};

export const AppHeader = ({
  actions,
  center,
  className,
  innerClassName,
  leading,
  ...props
}: AppHeaderProps) => {
  return (
    <header
      className={cn(
        "border-hairline bg-background/80 sticky top-0 z-40 border-b backdrop-blur-md",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "mx-auto grid min-h-16 max-w-400 grid-cols-[1fr_auto] items-center gap-3 px-4 sm:px-6 md:grid-cols-[1fr_auto_1fr] lg:px-10",
          innerClassName,
        )}
      >
        <div className="min-w-0 justify-self-start">
          {leading ?? <AppLogo href="/" />}
        </div>
        {center ? (
          <nav className="hidden items-center justify-center gap-6 md:flex">
            {center}
          </nav>
        ) : (
          <span className="hidden md:block" />
        )}
        {actions ? (
          <nav className="flex items-center justify-end gap-3 justify-self-end">
            {actions}
          </nav>
        ) : null}
      </div>
    </header>
  );
};
