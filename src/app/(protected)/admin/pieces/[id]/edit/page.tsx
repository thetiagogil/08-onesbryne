import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminImageManager } from "@/features/admin/components/admin-image-manager";
import { PieceForm } from "@/features/admin/components/piece-form";
import { getAdminPiece } from "@/features/admin/server/queries";
import {
  getActiveCategories,
  getCategorySizeOptions,
} from "@/features/catalog/server/queries";
import { Button } from "@/shared/components/ui/button";
import { EyebrowLink } from "@/shared/components/ui/eyebrow-link";
import { requireAdmin } from "@/shared/server/auth";

export const dynamic = "force-dynamic";

type EditPiecePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPiecePage({ params }: EditPiecePageProps) {
  await requireAdmin();
  const { id } = await params;
  const [piece, categories, categorySizeOptions] = await Promise.all([
    getAdminPiece(id),
    getActiveCategories(),
    getCategorySizeOptions(),
  ]);

  if (!piece) notFound();

  return (
    <section className="mx-auto max-w-4xl px-6 py-16 lg:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <EyebrowLink href="/admin/pieces">Back to pieces</EyebrowLink>
        <Button asChild size="sm" variant="outline">
          <Link href={`/pieces/${piece.code}`}>View public page</Link>
        </Button>
      </div>

      <div className="mt-8 border-b border-hairline pb-6">
        <h1 className="font-display text-4xl">{piece.code}</h1>
      </div>

      <div className="mt-10 space-y-10">
        <PieceForm
          categories={categories}
          categorySizeOptions={categorySizeOptions}
          piece={piece}
        >
          <AdminImageManager
            images={piece.images}
            pieceId={piece.id}
            pieceName={piece.name}
          />
        </PieceForm>
      </div>
    </section>
  );
}
