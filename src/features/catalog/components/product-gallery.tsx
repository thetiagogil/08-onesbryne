"use client";

import Image from "next/image";
import { useState } from "react";

import type { PieceImage } from "@/shared/types";
import { cn } from "@/shared/utils/cn";

type ProductGalleryProps = {
  images: PieceImage[];
  pieceName: string;
};

export function ProductGallery({ images, pieceName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex];

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
        {activeImage ? (
          <Image
            alt={activeImage.altText ?? pieceName}
            className="h-full w-full object-cover"
            fill
            priority
            sizes="(min-width: 1024px) 58vw, 100vw"
            src={activeImage.publicUrl}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[11px] tracking-eyebrow text-muted-foreground uppercase">
            Image pending
          </div>
        )}
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              aria-label={`Show image ${index + 1}`}
              className={cn(
                "relative aspect-square overflow-hidden border bg-surface",
                index === activeIndex ? "border-accent" : "border-transparent",
              )}
              key={image.id}
              onClick={() => setActiveIndex(index)}
              type="button"
            >
              <Image
                alt={image.altText ?? ""}
                className="h-full w-full object-cover"
                fill
                sizes="20vw"
                src={image.publicUrl}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
