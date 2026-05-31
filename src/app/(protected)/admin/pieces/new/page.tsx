import { PieceForm } from "@/features/admin/components/piece-form";
import {
  getActiveCategories,
  getCategorySizeOptions,
} from "@/features/catalog/server/queries";
import { EyebrowLink } from "@/shared/components/ui/eyebrow-link";
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
      <EyebrowLink href="/admin/pieces">Back to pieces</EyebrowLink>
      <div className="mt-8 border-b border-hairline pb-6">
        <h1 className="font-display text-4xl">Create catalog entry</h1>
      </div>
      <div className="mt-10">
        <PieceForm
          categories={categories}
          categorySizeOptions={categorySizeOptions}
        />
      </div>
    </section>
  );
}
