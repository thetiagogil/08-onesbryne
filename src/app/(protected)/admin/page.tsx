import { AdminPiecesPageView } from "@/features/admin/components/admin-pieces-page-view";
import { getAdminPieces } from "@/features/admin/server/queries";
import { getActiveCategories } from "@/features/catalog/server/queries";
import { requireAdmin } from "@/shared/server/auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdmin();
  const [categories, pieces] = await Promise.all([
    getActiveCategories(),
    getAdminPieces(),
  ]);

  return (
    <AdminPiecesPageView
      categories={categories}
      pieces={pieces}
    />
  );
}
