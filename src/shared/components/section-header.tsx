import type { ReactNode } from "react";

import { cn } from "@/shared/utils/cn";

type SectionHeaderProps = {
  action?: ReactNode;
  className?: string;
  description?: ReactNode;
  title: ReactNode;
};

export const SectionHeader = ({
  action,
  className,
  description,
  title,
}: SectionHeaderProps) => {
  return (
    <div
      className={cn(
        "border-hairline flex flex-wrap items-end justify-between gap-5 border-b pb-4",
        className,
      )}
    >
      <div className="min-w-0">
        <h2 className="font-display text-3xl leading-tight md:text-5xl">
          {title}
        </h2>
        {description ? (
          <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-relaxed">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
};
