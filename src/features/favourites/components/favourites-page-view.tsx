import { ProductCard } from "@/features/catalog/components/product-card";
import { EyebrowLink } from "@/shared/components/ui/eyebrow-link";
import type { Piece } from "@/shared/types";

type FavouritesPageViewProps = {
  pieces: Piece[];
};

export function FavouritesPageView({ pieces }: FavouritesPageViewProps) {
  return (
    <section className="mx-auto max-w-400 px-6 py-16 lg:px-10">
      <h1 className="font-display text-4xl md:text-6xl">Favourites</h1>

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
        <div className="mt-16 border border-hairline px-6 py-24 text-center">
          <h2 className="font-display text-2xl">Nothing saved yet</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Browse the catalog and tap the heart on pieces you would like to
            remember.
          </p>
          <EyebrowLink className="mt-6 inline-block" href="/catalog">
            Browse catalog
          </EyebrowLink>
        </div>
      )}
    </section>
  );
}
