import { ProductCard } from "@/features/catalog/components/product-card";
import { EmptyState } from "@/shared/components/empty-state";
import { PageHeader } from "@/shared/components/page-header";
import { EyebrowLink } from "@/shared/components/ui/eyebrow-link";
import type { Piece } from "@/shared/types";

type FavouritesPageViewProps = {
  pieces: Piece[];
};

export function FavouritesPageView({ pieces }: FavouritesPageViewProps) {
  return (
    <section className="mx-auto max-w-400 px-6 py-16 lg:px-10">
      <PageHeader
        description="Saved pieces stay here while they are visible in the catalog."
        title="Favourites"
      />

      {pieces.length ? (
        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-14 md:gap-x-6 lg:grid-cols-4">
          {pieces.map((piece, index) => (
            <ProductCard
              key={piece.id}
              piece={piece}
              priority={index === 0}
              variant="storefront"
            />
          ))}
        </div>
      ) : (
        <EmptyState
          actionHref="/catalog"
          actionLabel="Browse catalog"
          className="mt-16"
          description="Browse the catalog and save the pieces you would like to remember."
          title="Nothing saved yet"
        />
      )}
      {pieces.length ? (
        <div className="mt-12 text-center md:hidden">
          <EyebrowLink className="mt-6 inline-block" href="/catalog">
            Browse catalog
          </EyebrowLink>
        </div>
      ) : null}
    </section>
  );
}
