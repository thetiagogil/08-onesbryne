import { CatalogPageView } from "@/app/catalog/_components/catalog-page-view";
import { getCatalogData } from "@/features/catalog/server/queries";
import { normalizeQueryParam } from "@/features/catalog/lib/format";
import { normalizeCatalogSort } from "@/features/catalog/lib/catalog-routing";
import { SiteShell } from "@/shared/components/layout/site-shell";
import { SetupMissing } from "@/shared/components/setup-missing";
import { getCurrentUser } from "@/shared/server/auth";

export const dynamic = "force-dynamic";

type CatalogPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  const category = normalizeQueryParam(params.category);
  const query = normalizeQueryParam(params.q);
  const size = normalizeQueryParam(params.size);
  const sort = normalizeCatalogSort(normalizeQueryParam(params.sort));
  const [currentUser, data] = await Promise.all([
    getCurrentUser(),
    getCatalogData({ category, query, size, sort }),
  ]);

  if (!data.configured) {
    return (
      <SiteShell currentUser={currentUser}>
        <SetupMissing />
      </SiteShell>
    );
  }

  return (
    <SiteShell currentUser={currentUser}>
      <CatalogPageView
        categories={data.categories}
        currentCategory={data.activeCategory}
        currentSize={data.activeSize}
        pieces={data.pieces}
        query={query}
        sort={sort}
        sizes={data.sizes}
      />
    </SiteShell>
  );
}
