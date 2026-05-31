"use client";

import { Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { signOutAction } from "@/shared/server/auth-actions";
import { cn } from "@/shared/utils/cn";

type SignOutButtonProps = {
  className?: string;
  iconOnly?: boolean;
  pendingLabel?: string;
};

export function SignOutButton({
  className,
  iconOnly = false,
  pendingLabel = "Logging out",
}: SignOutButtonProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <span className={iconOnly ? "inline-flex" : "flex flex-col items-stretch gap-1"}>
      <button
        aria-label={iconOnly ? (isPending ? pendingLabel : "Log out") : undefined}
        className={cn(
          iconOnly
            ? "inline-flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4"
            : "flex items-center gap-2 text-[11px] tracking-eyebrow text-muted-foreground uppercase transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-3.5",
          className,
        )}
        disabled={isPending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const result = await signOutAction();

            if (!result.ok) {
              setError(result.error);
              return;
            }

            router.replace("/");
            router.refresh();
          });
        }}
        title={iconOnly ? (isPending ? pendingLabel : "Log out") : undefined}
        type="button"
      >
        {isPending ? <Loader2 className="animate-spin" /> : <LogOut />}
        {iconOnly ? null : isPending ? pendingLabel : "Log out"}
      </button>
      {error ? (
        <span className="text-xs tracking-normal text-destructive normal-case">
          {error}
        </span>
      ) : null}
    </span>
  );
}
