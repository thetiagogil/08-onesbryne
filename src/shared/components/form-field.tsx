import type { ReactNode } from "react";

import { cn } from "@/shared/utils/cn";

type FormFieldProps = {
  children: ReactNode;
  className?: string;
  htmlFor: string;
  label: string;
  required?: boolean;
};

export function FormField({
  children,
  className,
  htmlFor,
  label,
  required = false,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label
        className="block text-[11px] tracking-eyebrow text-muted-foreground uppercase"
        htmlFor={htmlFor}
      >
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {children}
    </div>
  );
}
