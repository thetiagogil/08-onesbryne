import * as React from "react";

import { cn } from "@/shared/utils/cn";

export const Textarea = ({
  className,
  ...props
}: React.ComponentProps<"textarea">) => {
  return (
    <textarea
      className={cn(
        "focus-soft border-hairline text-foreground placeholder:text-muted-foreground/60 min-h-28 w-full border bg-transparent p-3 text-sm disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
};
