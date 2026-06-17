import { FavouritesPageView } from "@/app/(protected)/favourites/_components/favourites-page-view";
import { getFavouritePieces } from "@/features/catalog/server/queries";
import { SetupMissing } from "@/shared/components/setup-missing";
import { requireUser } from "@/shared/server/auth";

export const dynamic = "force-dynamic";

export default async function FavouritesPage() {
  const currentUser = await requireUser("/favourites");
  const data = await getFavouritePieces(currentUser.id);

  if (!data.configured) return <SetupMissing />;

  return <FavouritesPageView pieces={data.pieces} />;
}
