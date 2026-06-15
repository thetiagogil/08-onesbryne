import { Heart, ShieldCheck } from "lucide-react";

import { ActionLink } from "@/shared/components/action-link";
import { AccountStat } from "@/features/settings/components/account-stat";
import { PageHeader } from "@/shared/components/page-header";
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
      <PageHeader
        description={currentUser.email}
        title={currentUser.profile.displayName ?? "Onesbryne customer"}
      />

      <div className="mt-12 border border-hairline">
        <AccountStat label="Favourites" value={favouriteCount} />
      </div>

      <div className="mt-12 space-y-4">
        <ProfileEditor currentUser={currentUser} />
        <ActionLink
          href="/favourites"
          icon={<Heart />}
        >
          View favourites
        </ActionLink>
        {currentUser.profile.appRole === "admin" ? (
          <ActionLink
            href="/admin"
            icon={<ShieldCheck />}
          >
            Open admin
          </ActionLink>
        ) : null}
        <SignOutButton className="w-full border border-hairline px-6 py-4 text-left hover:border-destructive hover:text-destructive" />
      </div>
    </section>
  );
}
