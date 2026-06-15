import type { ReactNode } from "react";

import { cn } from "@/shared/utils/cn";

type FormFeedbackTone = "error" | "success" | "info";

type FormFeedbackProps = {
  children: ReactNode;
  className?: string;
  tone?: FormFeedbackTone;
};

const formFeedbackTones: Record<FormFeedbackTone, string> = {
  error: "border-destructive/40 text-destructive",
  info: "border-hairline text-muted-foreground",
  success: "border-accent/40 text-accent",
};

export function FormFeedback({
  children,
  className,
  tone = "info",
}: FormFeedbackProps) {
  return (
    <div
      className={cn(
        "border px-4 py-3 text-sm leading-relaxed",
        formFeedbackTones[tone],
        className,
      )}
    >
      {children}
    </div>
  );
}
