import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/shared/utils/cn";

type AppShellProps = ComponentPropsWithoutRef<"div">;

export function AppShell({ className, ...props }: AppShellProps) {
  return (
    <div
      className={cn("flex min-h-dvh flex-col bg-background text-foreground", className)}
      {...props}
    />
  );
}
