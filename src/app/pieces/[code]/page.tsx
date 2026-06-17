import { notFound } from "next/navigation";

import { ProductDetailView } from "@/app/pieces/[code]/_components/product-detail-view";
import { normalizeCode } from "@/features/catalog/lib/format";
import {
  getFavouritePieceIds,
  getPieceByCode,
} from "@/features/catalog/server/queries";
import { SiteShell } from "@/shared/components/layout/site-shell";
import { SetupMissing } from "@/shared/components/setup-missing";
import { getCurrentUser } from "@/shared/server/auth";

export const dynamic = "force-dynamic";

type PiecePageProps = {
  params: Promise<{ code: string }>;
};

export default async function PiecePage({ params }: PiecePageProps) {
  const { code } = await params;
  const currentUser = await getCurrentUser();
  const result = await getPieceByCode(normalizeCode(code));

  if (!result.configured) {
    return (
      <SiteShell currentUser={currentUser}>
        <SetupMissing />
      </SiteShell>
    );
  }
  if (!result.piece) notFound();

  const favourites = await getFavouritePieceIds(currentUser?.id);

  return (
    <SiteShell currentUser={currentUser}>
      <ProductDetailView
        isFavourite={favourites.has(result.piece.id)}
        isSignedIn={Boolean(currentUser)}
        piece={result.piece}
      />
    </SiteShell>
  );
}
