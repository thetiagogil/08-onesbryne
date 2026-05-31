import Image from "next/image";
import Link from "next/link";

import { formatPrice } from "@/features/catalog/lib/format";
import { formatPieceSize } from "@/shared/constants/piece-attributes";
import type { Piece } from "@/shared/types";

type ProductCardProps = {
  piece: Piece;
  priority?: boolean;
  variant?: "catalog" | "storefront";
};

export function ProductCard({
  piece,
  priority = false,
  variant = "catalog",
}: ProductCardProps) {
  const primaryImage = piece.images[0];
  const isStorefront = variant === "storefront";

  return (
    <Link className="group block" href={`/pieces/${piece.code}`}>
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
        {primaryImage ? (
          <Image
            alt={primaryImage.altText ?? piece.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            fill
            priority={priority}
            sizes="(min-width: 1024px) 25vw, 50vw"
            src={primaryImage.publicUrl}
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-[11px] tracking-eyebrow text-muted-foreground uppercase">
            Image pending
          </div>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] tracking-eyebrow text-muted-foreground uppercase">
            {isStorefront
              ? piece.code
              : `${piece.code} - ${formatPieceSize(piece.size)}`}
          </div>
          <h3 className="mt-1 font-display text-lg leading-tight">
            {piece.name}
          </h3>
          {!isStorefront && piece.brand ? (
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {piece.brand}
            </p>
          ) : null}
        </div>
        <p className="shrink-0 whitespace-nowrap text-sm text-muted-foreground">
          {formatPrice(piece.priceCents)}
        </p>
      </div>
    </Link>
  );
}
