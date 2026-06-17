import type { ActionResult } from "@/shared/server/action-result";
import {
  ACCEPTED_PIECE_IMAGE_MIME_TYPES,
  MAX_IMAGE_BYTES,
  type PieceImageMimeType,
} from "@/shared/constants/app";
import {
  isPieceCondition,
  isPieceSize,
} from "@/shared/constants/piece-attributes";
import {
  pieceStatuses,
  type PieceCondition,
  type PieceSize,
  type PieceStatus,
} from "@/shared/types";
import {
  PIECE_IMAGE_FILE_FIELD,
  PIECE_IMAGE_HEIGHT_FIELD,
  PIECE_IMAGE_WIDTH_FIELD,
} from "@/features/admin/lib/piece-image-form";

export type PieceFormInput = {
  brand: string | null;
  categorySlug: string;
  condition: PieceCondition | null;
  description: string;
  name: string;
  priceCents: number;
  size: PieceSize;
  status: PieceStatus;
};

export type CreatePieceImageFormInput = {
  byteSize: number;
  file: File;
  height: number | null;
  mimeType: PieceImageMimeType;
  width: number | null;
};

export const normalizePieceFormData = (
  formData: FormData,
): ActionResult<PieceFormInput> => {
  const name = readString(formData, "name");
  const brand = readOptionalString(formData, "brand");
  const categorySlug = readString(formData, "categorySlug");
  const size = readString(formData, "size");
  const condition = readOptionalString(formData, "condition");
  const description = readString(formData, "description");
  const status = readString(formData, "status");
  const priceValue = readString(formData, "price");
  const price = Number(priceValue.replace(",", "."));

  if (!name) return { ok: false, error: "Name is required." };
  if (!categorySlug) return { ok: false, error: "Category is required." };
  if (!isPieceSize(size)) return { ok: false, error: "Size is invalid." };
  let normalizedCondition: PieceCondition | null = null;
  if (condition) {
    if (!isPieceCondition(condition)) {
      return { ok: false, error: "Condition is invalid." };
    }
    normalizedCondition = condition;
  }
  if (!description) return { ok: false, error: "Description is required." };
  if (!Number.isFinite(price) || price < 0) {
    return { ok: false, error: "Price must be a valid positive number." };
  }
  if (!isPieceStatus(status)) {
    return { ok: false, error: "Status is invalid." };
  }

  return {
    ok: true,
    data: {
      brand,
      categorySlug,
      condition: normalizedCondition,
      description,
      name,
      priceCents: Math.round(price * 100),
      size,
      status,
    },
  };
};

export function isPieceStatus(value: string): value is PieceStatus {
  return pieceStatuses.includes(value as PieceStatus);
}

export const normalizeCreatePieceImageFormData = (
  formData: FormData,
): ActionResult<CreatePieceImageFormInput> => {
  const file = formData.get(PIECE_IMAGE_FILE_FIELD);

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Add an image before creating a piece." };
  }

  if (!isAcceptedPieceImageMimeType(file.type)) {
    return { ok: false, error: "Only WebP and JPEG images are allowed." };
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: "Image must be 3 MiB or smaller." };
  }

  return {
    ok: true,
    data: {
      byteSize: file.size,
      file,
      height: readOptionalPositiveInteger(formData, PIECE_IMAGE_HEIGHT_FIELD),
      mimeType: file.type,
      width: readOptionalPositiveInteger(formData, PIECE_IMAGE_WIDTH_FIELD),
    },
  };
};

export function isAcceptedPieceImageMimeType(
  value: string,
): value is PieceImageMimeType {
  return ACCEPTED_PIECE_IMAGE_MIME_TYPES.includes(value as PieceImageMimeType);
}

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readOptionalString(formData: FormData, key: string) {
  const value = readString(formData, key);
  return value || null;
}

function readOptionalPositiveInteger(formData: FormData, key: string) {
  const value = readString(formData, key);
  if (!value) return null;

  const number = Number(value);
  return Number.isSafeInteger(number) && number > 0 ? number : null;
}
