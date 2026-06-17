"use client";

import { Loader2, Upload } from "lucide-react";

import { AdminPieceImageCard } from "@/features/admin/components/admin-piece-image-card";
import { useAdminImageManager } from "@/features/admin/hooks/use-admin-image-manager";
import { ACCEPTED_PIECE_IMAGE_MIME_TYPES } from "@/shared/constants/app";
import { FormFeedback } from "@/shared/components/form-feedback";
import { Button } from "@/shared/components/ui/button";
import type { PieceImage } from "@/shared/types";

type AdminImageManagerProps = {
  images: PieceImage[];
  pieceId: string;
  pieceName: string;
};

export const AdminImageManager = ({
  images,
  pieceId,
  pieceName,
}: AdminImageManagerProps) => {
  const {
    deleteImage,
    deletePending,
    handleInputChange,
    inputRef,
    openFileDialog,
    state,
  } = useAdminImageManager({ pieceId, pieceName });

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="tracking-eyebrow text-muted-foreground text-[11px] uppercase">
          Images <span aria-hidden="true">*</span>
        </h2>
        <Button
          disabled={state.pending}
          onClick={openFileDialog}
          size="sm"
          type="button"
          variant="outline"
        >
          {state.pending ? <Loader2 className="animate-spin" /> : <Upload />}
          Upload image
        </Button>
        <input
          accept={ACCEPTED_PIECE_IMAGE_MIME_TYPES.join(",")}
          className="hidden"
          disabled={state.pending}
          onChange={handleInputChange}
          ref={inputRef}
          type="file"
        />
      </div>

      {state.error ? (
        <FormFeedback tone="error">{state.error}</FormFeedback>
      ) : null}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {images.map((image) => (
          <AdminPieceImageCard
            deleteDisabled={deletePending || images.length <= 1}
            image={image}
            key={image.id}
            onDelete={deleteImage}
          />
        ))}
        {!images.length ? (
          <div className="border-hairline text-muted-foreground col-span-full border border-dashed px-6 py-14 text-center text-sm">
            Every piece needs at least one compressed WebP or JPEG image.
          </div>
        ) : null}
      </div>
    </section>
  );
};
