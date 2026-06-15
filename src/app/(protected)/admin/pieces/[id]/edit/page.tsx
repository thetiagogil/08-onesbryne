import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";

import { AdminImageManager } from "@/features/admin/components/admin-image-manager";
import { PieceForm } from "@/features/admin/components/piece-form";
import { getAdminPiece } from "@/features/admin/server/queries";
import {
  getActiveCategories,
  getCategorySizeOptions,
} from "@/features/catalog/server/queries";
import { Button } from "@/shared/components/ui/button";
import { PageHeader } from "@/shared/components/page-header";
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
      <PageHeader
        actions={
          <Button asChild size="sm" variant="outline">
            <Link href={`/pieces/${piece.code}`}>
              <ExternalLink />
              View public page
            </Link>
          </Button>
        }
        backHref="/admin/pieces"
        backLabel="Back to pieces"
        description={piece.name}
        size="compact"
        title={piece.code}
      />

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
