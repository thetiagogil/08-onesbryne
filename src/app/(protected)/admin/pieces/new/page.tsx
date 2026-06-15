import { PieceForm } from "@/features/admin/components/piece-form";
import {
  getActiveCategories,
  getCategorySizeOptions,
} from "@/features/catalog/server/queries";
import { PageHeader } from "@/shared/components/page-header";
import { requireAdmin } from "@/shared/server/auth";

export const dynamic = "force-dynamic";

export default async function NewPiecePage() {
  await requireAdmin();
  const [categories, categorySizeOptions] = await Promise.all([
    getActiveCategories(),
    getCategorySizeOptions(),
  ]);

  return (
    <section className="mx-auto max-w-4xl px-6 py-16 lg:px-10">
      <PageHeader
        backHref="/admin/pieces"
        backLabel="Back to pieces"
        description="Add the product details and the first compressed image before creating the piece."
        size="compact"
        title="Create catalog entry"
      />
      <div className="mt-10">
        <PieceForm
          categories={categories}
          categorySizeOptions={categorySizeOptions}
        />
      </div>
    </section>
  );
}
