"use client";

import {
  ACCEPTED_PIECE_IMAGE_MIME_TYPES,
  MAX_IMAGE_BYTES,
  type PieceImageMimeType,
} from "@/shared/constants/app";

export type CompressedPieceImage = {
  blob: Blob;
  height: number;
  width: number;
};

export const validatePieceImageFile = (file: File) => {
  if (!isAcceptedPieceImageMimeType(file.type)) {
    throw new Error("Only JPEG and WebP images are supported.");
  }
};

export const compressPieceImage = async (
  file: File,
): Promise<CompressedPieceImage> => {
  const bitmap = await createImageBitmap(file);
  const maxDimension = 1800;
  const scale = Math.min(
    1,
    maxDimension / Math.max(bitmap.width, bitmap.height),
  );
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not prepare image canvas.");

  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  for (const quality of [0.82, 0.72, 0.62, 0.52, 0.42]) {
    const blob = await canvasToBlob(canvas, "image/webp", quality);
    if (blob.size <= MAX_IMAGE_BYTES) {
      return { blob, height, width };
    }
  }

  throw new Error("Image is too large after compression.");
};

export const toCompressedPieceImageFile = (
  file: File,
  image: CompressedPieceImage,
) => {
  return new File([image.blob], `${getImageBaseName(file.name)}.webp`, {
    type: image.blob.type,
  });
};

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Could not compress image."));
          return;
        }

        resolve(blob);
      },
      type,
      quality,
    );
  });
}

function getImageBaseName(fileName: string) {
  return (
    fileName
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase()
      .slice(0, 48) || "piece"
  );
}

function isAcceptedPieceImageMimeType(
  value: string,
): value is PieceImageMimeType {
  return ACCEPTED_PIECE_IMAGE_MIME_TYPES.includes(value as PieceImageMimeType);
}
