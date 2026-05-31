import type { ReactNode } from "react";

type AuthFieldProps = {
  children: ReactNode;
  htmlFor: string;
  label: string;
};

export function AuthField({ children, htmlFor, label }: AuthFieldProps) {
  return (
    <label className="block" htmlFor={htmlFor}>
      <span className="text-[11px] tracking-eyebrow text-muted-foreground uppercase">
        {label}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
