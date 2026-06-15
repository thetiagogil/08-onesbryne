import * as React from "react";

import { cn } from "@/shared/utils/cn";

export function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "focus-soft h-11 w-full border-b border-hairline bg-transparent px-0 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      type={type}
      {...props}
    />
  );
}
