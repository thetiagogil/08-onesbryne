import { ProductDetailRow } from "@/features/catalog/components/product-detail-row";
import { ProductGallery } from "@/features/catalog/components/product-gallery";
import {
  formatCategoryLabel,
  formatPrice,
} from "@/features/catalog/lib/format";
import { FavouriteButton } from "@/features/favourites/components/favourite-button";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { EyebrowLink } from "@/shared/components/ui/eyebrow-link";
import { SELLER_EMAIL } from "@/shared/constants/app";
import {
  formatPieceCondition,
  formatPieceSize,
  formatPieceStatus,
} from "@/shared/constants/piece-attributes";
import type { Piece } from "@/shared/types";

type ProductDetailViewProps = {
  isFavourite: boolean;
  isSignedIn: boolean;
  piece: Piece;
};

export const ProductDetailView = ({
  isFavourite,
  isSignedIn,
  piece,
}: ProductDetailViewProps) => {
  const subject = `Inquiry - ${piece.code} ${piece.name}`;
  const body = [
    "Hello,",
    "",
    "I am interested in the following piece:",
    "",
    `${piece.code} - ${piece.name}`,
    `Size: ${formatPieceSize(piece.size)}`,
    `Price: ${formatPrice(piece.priceCents)}`,
    "",
    "Could you let me know if it is still available?",
    "",
    "Thank you.",
  ].join("\n");
  const mailto = `mailto:${SELLER_EMAIL}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;

  return (
    <section className="mx-auto max-w-400 px-4 pt-8 pb-24 md:px-6 lg:px-10">
      <EyebrowLink href="/catalog">Back to catalog</EyebrowLink>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <ProductGallery images={piece.images} pieceName={piece.name} />

        <div className="self-start lg:sticky lg:top-24">
          <div className="flex flex-wrap items-center gap-3">
            <p className="tracking-eyebrow text-muted-foreground text-[11px] uppercase">
              {piece.code}
            </p>
            {piece.status !== "available" ? (
              <Badge tone="accent">{formatPieceStatus(piece.status)}</Badge>
            ) : null}
          </div>
          <h1 className="font-display mt-3 text-4xl leading-tight md:text-5xl">
            {piece.name}
          </h1>
          {piece.brand ? (
            <p className="text-muted-foreground mt-2 text-sm">{piece.brand}</p>
          ) : null}

          <div className="mt-8 flex items-baseline gap-4">
            <p className="font-display text-3xl">
              {formatPrice(piece.priceCents)}
            </p>
          </div>

          <dl className="divide-hairline border-hairline mt-10 divide-y border-y text-sm">
            <ProductDetailRow
              label="Size"
              value={formatPieceSize(piece.size)}
            />
            <ProductDetailRow
              label="Category"
              value={formatCategoryLabel(piece.categorySlug)}
            />
            {piece.condition ? (
              <ProductDetailRow
                label="Condition"
                value={formatPieceCondition(piece.condition)}
              />
            ) : null}
            <ProductDetailRow label="Reference" value={piece.code} />
            <ProductDetailRow
              label="Status"
              value={formatPieceStatus(piece.status)}
            />
          </dl>

          <p className="text-muted-foreground mt-8 text-sm leading-relaxed">
            {piece.description}
          </p>

          <div className="mt-10 flex flex-col gap-3">
            {piece.status === "available" ? (
              <Button asChild size="lg">
                <a href={mailto}>Inquire by email</a>
              </Button>
            ) : (
              <div className="border-hairline tracking-eyebrow text-muted-foreground border px-6 py-4 text-center text-[11px] uppercase">
                This piece is no longer available
              </div>
            )}
            <FavouriteButton
              isFavourite={isFavourite}
              isSignedIn={isSignedIn}
              pieceId={piece.id}
              returnPath={`/pieces/${piece.code}`}
            />
          </div>

          <p className="text-muted-foreground mt-8 text-xs leading-relaxed">
            Each piece is one of one. Payment, shipping and pickup are
            coordinated personally with the seller.
          </p>
        </div>
      </div>
    </section>
  );
};
