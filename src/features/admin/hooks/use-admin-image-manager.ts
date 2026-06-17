"use client";

import { useRouter } from "next/navigation";
import { type ChangeEvent, useRef, useState, useTransition } from "react";

import {
  compressPieceImage,
  validatePieceImageFile,
} from "@/features/admin/lib/piece-image-processing";
import { buildPieceImageStoragePath } from "@/features/admin/lib/piece-image-storage";
import {
  addPieceImageAction,
  deletePieceImageAction,
} from "@/features/admin/server/actions";
import { PIECE_IMAGE_BUCKET } from "@/shared/constants/app";
import { createClient } from "@/lib/supabase/browser";
import type { PieceImage } from "@/shared/types";

type UploadState = {
  error: string | null;
  pending: boolean;
};

type UseAdminImageManagerInput = {
  pieceId: string;
  pieceName: string;
};

export const useAdminImageManager = ({
  pieceId,
  pieceName,
}: UseAdminImageManagerInput) => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadState>({
    error: null,
    pending: false,
  });
  const [deletePending, startDeleteTransition] = useTransition();

  async function uploadSelectedFile(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;

    setState({ error: null, pending: true });

    try {
      validatePieceImageFile(file);
      const compressed = await compressPieceImage(file);
      const storagePath = buildPieceImageStoragePath({
        originalName: file.name,
        pieceId,
        uniqueId: crypto.randomUUID(),
      });
      const supabase = createClient();

      const { error: uploadError } = await supabase.storage
        .from(PIECE_IMAGE_BUCKET)
        .upload(storagePath, compressed.blob, {
          cacheControl: "31536000",
          contentType: compressed.blob.type,
          upsert: false,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const result = await addPieceImageAction({
        altText: pieceName,
        byteSize: compressed.blob.size,
        height: compressed.height,
        mimeType: compressed.blob.type as "image/webp",
        pieceId,
        storagePath,
        width: compressed.width,
      });

      if (!result.ok) {
        await supabase.storage.from(PIECE_IMAGE_BUCKET).remove([storagePath]);
        throw new Error(result.error);
      }

      if (inputRef.current) inputRef.current.value = "";
      router.refresh();
    } catch (error) {
      setState({
        error: error instanceof Error ? error.message : "Image upload failed.",
        pending: false,
      });
      return;
    }

    setState({ error: null, pending: false });
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    void uploadSelectedFile(event.target.files);
  }

  function openFileDialog() {
    inputRef.current?.click();
  }

  function deleteImage(image: PieceImage) {
    startDeleteTransition(async () => {
      setState((current) => ({ ...current, error: null }));
      const result = await deletePieceImageAction(
        pieceId,
        image.id,
        image.storagePath,
      );

      if (!result.ok) {
        setState((current) => ({
          ...current,
          error: result.error,
        }));
        return;
      }

      router.refresh();
    });
  }

  return {
    deleteImage,
    deletePending,
    handleInputChange,
    inputRef,
    openFileDialog,
    state,
  };
};
