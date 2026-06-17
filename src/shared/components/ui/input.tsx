import * as React from "react";

import { cn } from "@/shared/utils/cn";

export const Input = ({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) => {
  return (
    <input
      className={cn(
        "focus-soft border-hairline text-foreground placeholder:text-muted-foreground/60 h-11 w-full border-b bg-transparent px-0 py-2 text-sm disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      type={type}
      {...props}
    />
  );
};
