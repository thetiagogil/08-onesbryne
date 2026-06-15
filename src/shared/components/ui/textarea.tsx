import * as React from "react";

import { cn } from "@/shared/utils/cn";

export function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "focus-soft min-h-28 w-full border border-hairline bg-transparent p-3 text-sm text-foreground placeholder:text-muted-foreground/60 disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
