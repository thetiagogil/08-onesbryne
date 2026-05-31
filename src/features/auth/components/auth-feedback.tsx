import type { ReactNode } from "react";

import { cn } from "@/shared/utils/cn";

type AuthFeedbackProps = {
  children: ReactNode;
  tone: "error" | "success";
};

export function AuthFeedback({ children, tone }: AuthFeedbackProps) {
  return (
    <div
      className={cn(
        "border px-4 py-3 text-sm",
        tone === "error"
          ? "border-destructive/40 text-destructive"
          : "border-accent/40 text-accent",
      )}
    >
      {children}
    </div>
  );
}
