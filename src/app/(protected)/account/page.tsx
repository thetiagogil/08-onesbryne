import { AccountPageView } from "@/app/(protected)/account/_components/account-page-view";
import { getFavouritePieceIds } from "@/features/catalog/server/queries";
import { requireUser } from "@/shared/server/auth";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const currentUser = await requireUser("/account");
  const favourites = await getFavouritePieceIds(currentUser.id);

  return (
    <AccountPageView
      currentUser={currentUser}
      favouriteCount={favourites.size}
    />
  );
}
