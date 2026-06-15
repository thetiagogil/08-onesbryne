import Link from "next/link";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/cn";

type EmptyStateProps = {
  actionHref?: string;
  actionLabel?: string;
  className?: string;
  description?: string;
  title: string;
};

export function EmptyState({
  actionHref,
  actionLabel,
  className,
  description,
  title,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "border border-hairline px-6 py-20 text-center",
        className,
      )}
    >
      <h2 className="font-display text-3xl">{title}</h2>
      {description ? (
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
      {actionHref && actionLabel ? (
        <Button asChild className="mt-8" variant="outline">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      ) : null}
    </div>
  );
}
