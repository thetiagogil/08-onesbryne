"use client";

import { type FormEvent, useActionState, useState, useTransition } from "react";

import {
  PIECE_IMAGE_FILE_FIELD,
  PIECE_IMAGE_HEIGHT_FIELD,
  PIECE_IMAGE_WIDTH_FIELD,
} from "@/features/admin/lib/piece-image-form";
import {
  compressPieceImage,
  toCompressedPieceImageFile,
  validatePieceImageFile,
} from "@/features/admin/lib/piece-image-processing";
import {
  createPieceAction,
  updatePieceAction,
  type PieceFormState,
} from "@/features/admin/server/actions";
import type { Piece } from "@/shared/types";

type UsePieceFormInput = {
  piece?: Piece;
};

export const usePieceForm = ({ piece }: UsePieceFormInput) => {
  const isCreate = !piece;
  const action = piece
    ? updatePieceAction.bind(null, piece.id)
    : createPieceAction;
  const [state, formAction, isActionPending] = useActionState<
    PieceFormState,
    FormData
  >(action, null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isPreparingImage, setIsPreparingImage] = useState(false);
  const [isTransitionPending, startTransition] = useTransition();
  const isPending = isActionPending || isPreparingImage || isTransitionPending;
  const error = localError ?? (state && !state.ok ? state.error : null);
  const pendingLabel = isPreparingImage
    ? "Preparing image"
    : piece
      ? "Saving piece"
      : "Creating piece";

  async function handleCreateSubmit(event: FormEvent<HTMLFormElement>) {
    if (!isCreate) return;

    event.preventDefault();
    setLocalError(null);

    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    const imageFile = formData.get(PIECE_IMAGE_FILE_FIELD);

    if (!(imageFile instanceof File) || imageFile.size === 0) {
      setLocalError("Add an image before creating a piece.");
      return;
    }

    try {
      setIsPreparingImage(true);
      validatePieceImageFile(imageFile);

      const image = await compressPieceImage(imageFile);
      formData.set(
        PIECE_IMAGE_FILE_FIELD,
        toCompressedPieceImageFile(imageFile, image),
      );
      formData.set(PIECE_IMAGE_WIDTH_FIELD, String(image.width));
      formData.set(PIECE_IMAGE_HEIGHT_FIELD, String(image.height));

      startTransition(() => {
        formAction(formData);
      });
    } catch (error) {
      setLocalError(
        error instanceof Error ? error.message : "Could not prepare image.",
      );
    } finally {
      setIsPreparingImage(false);
    }
  }

  return {
    action: isCreate ? undefined : formAction,
    error,
    handleCreateSubmit: isCreate ? handleCreateSubmit : undefined,
    isCreate,
    isPending,
    pendingLabel,
    state,
  };
};
