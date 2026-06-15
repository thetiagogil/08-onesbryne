import type { ReactNode } from "react";

import { FormFeedback } from "@/shared/components/form-feedback";

type AuthFeedbackProps = {
  children: ReactNode;
  tone: "error" | "success";
};

export function AuthFeedback({ children, tone }: AuthFeedbackProps) {
  return <FormFeedback tone={tone}>{children}</FormFeedback>;
}
