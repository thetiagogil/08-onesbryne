export const APP_NAME = "Onesbryne";

export const APP_DESCRIPTION =
  "A curated fashion resale catalog of selected one-of-one pieces.";

export const SELLER_EMAIL = "onesbryne@gmail.com";

export const PIECE_IMAGE_BUCKET = "piece-images";

export const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

export const ACCEPTED_PIECE_IMAGE_MIME_TYPES = [
  "image/webp",
  "image/jpeg",
] as const;

export type PieceImageMimeType =
  (typeof ACCEPTED_PIECE_IMAGE_MIME_TYPES)[number];
