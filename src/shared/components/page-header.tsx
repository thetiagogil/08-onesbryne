import type { ReactNode } from "react";

import { EyebrowLink } from "@/shared/components/ui/eyebrow-link";
import { cn } from "@/shared/utils/cn";

type PageHeaderProps = {
  align?: "center" | "start";
  actions?: ReactNode;
  backHref?: string;
  backLabel?: string;
  className?: string;
  description?: ReactNode;
  size?: "compact" | "default";
  title: ReactNode;
};

export const PageHeader = ({
  align = "start",
  actions,
  backHref,
  backLabel = "Back",
  className,
  description,
  size = "default",
  title,
}: PageHeaderProps) => {
  return (
    <header className={cn("border-hairline border-b pb-6", className)}>
      {backHref ? <EyebrowLink href={backHref}>{backLabel}</EyebrowLink> : null}
      <div
        className={cn(
          "mt-8 flex flex-wrap items-end gap-6",
          align === "center" ? "justify-center text-center" : "justify-between",
        )}
      >
        <div className="min-w-0">
          <h1
            className={cn(
              "font-display leading-tight",
              size === "compact" ? "text-4xl" : "text-4xl md:text-6xl",
            )}
          >
            {title}
          </h1>
          {description ? (
            <p className="text-muted-foreground mt-3 max-w-2xl text-sm leading-relaxed md:text-base">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
    </header>
  );
};
