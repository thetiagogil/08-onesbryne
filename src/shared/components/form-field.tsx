import type { ReactNode } from "react";

import { cn } from "@/shared/utils/cn";

type FormFieldProps = {
  children: ReactNode;
  className?: string;
  htmlFor: string;
  label: string;
  required?: boolean;
};

export const FormField = ({
  children,
  className,
  htmlFor,
  label,
  required = false,
}: FormFieldProps) => {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        className="tracking-eyebrow text-muted-foreground block text-[11px] uppercase"
        htmlFor={htmlFor}
      >
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {children}
    </div>
  );
};
