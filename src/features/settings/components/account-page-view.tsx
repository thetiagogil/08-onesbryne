import { Heart, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { AccountStat } from "@/features/settings/components/account-stat";
import { ProfileEditor } from "@/features/settings/components/profile-editor";
import { SignOutButton } from "@/shared/components/sign-out-button";
import type { CurrentUser } from "@/shared/types";

type AccountPageViewProps = {
  currentUser: CurrentUser;
  favouriteCount: number;
};

export function AccountPageView({
  currentUser,
  favouriteCount,
}: AccountPageViewProps) {
  return (
    <section className="mx-auto max-w-2xl px-6 py-24">
      <h1 className="font-display text-4xl">
        {currentUser.profile.displayName ?? "Onesbryne customer"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{currentUser.email}</p>

      <div className="mt-12 border border-hairline">
        <AccountStat label="Favourites" value={favouriteCount} />
      </div>

      <div className="mt-12 space-y-4">
        <ProfileEditor currentUser={currentUser} />
        <Link
          className="flex items-center gap-2 border border-hairline px-6 py-4 text-[11px] tracking-eyebrow uppercase transition-colors hover:border-accent"
          href="/favourites"
        >
          <Heart className="size-3.5" />
          View favourites
        </Link>
        {currentUser.profile.appRole === "admin" ? (
          <Link
            className="flex items-center gap-2 border border-hairline px-6 py-4 text-[11px] tracking-eyebrow uppercase transition-colors hover:border-accent"
            href="/admin"
          >
            <ShieldCheck className="size-3.5" />
            Open admin
          </Link>
        ) : null}
        <SignOutButton className="w-full border border-hairline px-6 py-4 text-left hover:border-destructive hover:text-destructive" />
      </div>
    </section>
  );
}
