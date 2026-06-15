import { Trash2 } from "lucide-react";
import Image from "next/image";

import { Button } from "@/shared/components/ui/button";
import type { PieceImage } from "@/shared/types";

type AdminPieceImageCardProps = {
  deleteDisabled: boolean;
  image: PieceImage;
  onDelete: (image: PieceImage) => void;
};

export function AdminPieceImageCard({
  deleteDisabled,
  image,
  onDelete,
}: AdminPieceImageCardProps) {
  return (
    <div className="group relative aspect-square overflow-hidden bg-surface">
      <Image
        alt={image.altText ?? ""}
        className="h-full w-full object-cover"
        fill
        sizes="(min-width: 768px) 25vw, 50vw"
        src={image.publicUrl}
      />
      <Button
        aria-label="Delete image"
        className="absolute top-2 right-2 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100"
        disabled={deleteDisabled}
        onClick={() => onDelete(image)}
        size="icon"
        title={
          deleteDisabled
            ? "Every piece needs at least one image."
            : "Delete image"
        }
        type="button"
        variant="danger"
      >
        <Trash2 />
      </Button>
    </div>
  );
}
