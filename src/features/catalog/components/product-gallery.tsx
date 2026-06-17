"use client";

import Image from "next/image";
import { useState } from "react";

import { ImagePlaceholder } from "@/shared/components/image-placeholder";
import type { PieceImage } from "@/shared/types";
import { cn } from "@/shared/utils/cn";

type ProductGalleryProps = {
  images: PieceImage[];
  pieceName: string;
};

export const ProductGallery = ({ images, pieceName }: ProductGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex];

  return (
    <div className="space-y-4">
      <div className="bg-surface relative aspect-[4/5] overflow-hidden">
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
          <ImagePlaceholder />
        )}
        {images.length > 1 ? (
          <div className="bg-background/85 tracking-eyebrow text-muted-foreground absolute right-3 bottom-3 px-3 py-1 text-[10px] uppercase backdrop-blur-sm">
            {activeIndex + 1} / {images.length}
          </div>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-5 gap-2 md:grid-cols-6">
          {images.map((image, index) => (
            <button
              aria-current={index === activeIndex}
              aria-label={`Show image ${index + 1}`}
              className={cn(
                "bg-surface focus-soft relative aspect-square overflow-hidden border transition-colors",
                index === activeIndex
                  ? "border-accent"
                  : "border-hairline hover:border-muted-foreground",
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
};
