"use client";

import { Loader2, LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/shared/components/ui/button";
import { signOutAction } from "@/shared/server/auth-actions";

type ProfileMenuProps = {
  displayName: string;
};

export function ProfileMenu({ displayName }: ProfileMenuProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3">
      {error ? (
        <span className="hidden text-xs text-destructive sm:inline">
          {error}
        </span>
      ) : null}
      <span className="hidden max-w-40 truncate text-xs text-muted-foreground sm:inline">
        {displayName}
      </span>
      <Button
        aria-label="Account"
        asChild
        className="md:hidden"
        size="icon"
        variant="ghost"
      >
        <Link href="/account">
          <UserRound />
        </Link>
      </Button>
      <Button
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
        size="sm"
        variant="ghost"
      >
        {isPending ? <Loader2 className="animate-spin" /> : <LogOut />}
        <span className="hidden sm:inline">Log out</span>
      </Button>
    </div>
  );
}
