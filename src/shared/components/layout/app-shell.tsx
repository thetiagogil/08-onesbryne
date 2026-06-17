import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/shared/utils/cn";

type AppShellProps = ComponentPropsWithoutRef<"div">;

export const AppShell = ({ className, ...props }: AppShellProps) => {
  return (
    <div
      className={cn(
        "bg-background text-foreground flex min-h-dvh flex-col",
        className,
      )}
      {...props}
    />
  );
};
