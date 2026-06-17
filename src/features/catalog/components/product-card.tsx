import Image from "next/image";
import Link from "next/link";

import { formatPrice } from "@/features/catalog/lib/format";
import { Badge } from "@/shared/components/ui/badge";
import { ImagePlaceholder } from "@/shared/components/image-placeholder";
import {
  formatPieceSize,
  formatPieceStatus,
} from "@/shared/constants/piece-attributes";
import type { Piece } from "@/shared/types";

type ProductCardProps = {
  piece: Piece;
  priority?: boolean;
  variant?: "catalog" | "storefront";
};

export const ProductCard = ({
  piece,
  priority = false,
  variant = "catalog",
}: ProductCardProps) => {
  const primaryImage = piece.images[0];
  const isStorefront = variant === "storefront";

  return (
    <Link className="group block" href={`/pieces/${piece.code}`}>
      <div className="bg-surface relative aspect-[4/5] overflow-hidden">
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
          <ImagePlaceholder />
        )}
        {piece.status !== "available" ? (
          <Badge className="absolute top-3 left-3" tone="accent">
            {formatPieceStatus(piece.status)}
          </Badge>
        ) : null}
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="tracking-eyebrow text-muted-foreground text-[10px] uppercase">
            {isStorefront
              ? piece.code
              : `${piece.code} - ${formatPieceSize(piece.size)}`}
          </div>
          <h3 className="font-display mt-1 text-lg leading-tight">
            {piece.name}
          </h3>
          {!isStorefront && piece.brand ? (
            <p className="text-muted-foreground mt-1 truncate text-xs">
              {piece.brand}
            </p>
          ) : null}
        </div>
        <p className="text-muted-foreground shrink-0 text-sm whitespace-nowrap">
          {formatPrice(piece.priceCents)}
        </p>
      </div>
    </Link>
  );
};
