import { CatalogFilters } from "@/features/catalog/components/catalog-filters";
import { ProductCard } from "@/features/catalog/components/product-card";
import type { CatalogSort } from "@/features/catalog/server/queries";
import { EmptyState } from "@/shared/components/empty-state";
import { PageHeader } from "@/shared/components/page-header";
import type { Category, Piece, PieceSize } from "@/shared/types";

type CatalogPageViewProps = {
  categories: Category[];
  currentCategory?: string;
  currentSize?: string;
  pieces: Piece[];
  query?: string;
  sort: CatalogSort;
  sizes: PieceSize[];
};

export function CatalogPageView({
  categories,
  currentCategory,
  currentSize,
  pieces,
  query,
  sort,
  sizes,
}: CatalogPageViewProps) {
  const filtersKey = [
    currentCategory ?? "",
    currentSize ?? "",
    query ?? "",
    sort,
  ].join(":");

  return (
    <>
      <section className="mx-auto w-full max-w-400 px-4 pt-16 pb-8 md:px-6 lg:px-10">
        <PageHeader
          description="Browse the available one-of-one pieces. Filters stay in the URL, so every view can be shared."
          title="All pieces"
        />
      </section>

      <CatalogFilters
        key={filtersKey}
        categories={categories}
        currentCategory={currentCategory}
        currentSize={currentSize}
        query={query}
        sort={sort}
        sizes={sizes}
      />

      <section className="mx-auto w-full max-w-400 px-4 py-12 md:px-6 lg:px-10">
        {pieces.length ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-14 md:gap-x-4 lg:grid-cols-4">
            {pieces.map((piece, index) => (
              <ProductCard
                key={piece.id}
                piece={piece}
                priority={index === 0}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            actionHref="/catalog"
            actionLabel="Clear filters"
            description="Try a different category, search, or sort option."
            title="No pieces match."
          />
        )}
      </section>
    </>
  );
}
