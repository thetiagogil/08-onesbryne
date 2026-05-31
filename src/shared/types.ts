import type { Enums, Tables } from "@/types/database.types";

export type ProfileRow = Tables<"profiles">;
export type CategoryRow = Tables<"categories">;
export type CategorySizeOptionRow = Tables<"category_size_options">;
export type PieceRow = Tables<"pieces">;
export type PieceImageRow = Tables<"piece_images">;
export type FavouriteRow = Tables<"favourites">;

export type AppRole = "admin" | "customer";

export type Profile = {
  appRole: AppRole;
  createdAt: string;
  displayName: string | null;
  id: string;
  updatedAt: string;
};

export type CurrentUser = {
  email: string | null;
  id: string;
  profile: Profile;
};

export type Category = {
  isActive: boolean;
  label: string;
  slug: string;
  sortOrder: number;
};

export type CategorySizeOption = {
  categorySlug: string;
  size: PieceSize;
  sortOrder: number;
};

export const pieceStatuses = [
  "draft",
  "available",
  "reserved",
  "sold",
  "archived",
] as const;

export type PieceStatus = (typeof pieceStatuses)[number];
export type PieceSize = Enums<"piece_size">;
export type PieceCondition = Enums<"piece_condition">;

export type PieceImage = {
  altText: string | null;
  byteSize: number | null;
  height: number | null;
  id: string;
  mimeType: string;
  position: number;
  publicUrl: string;
  storageBucket: string;
  storagePath: string;
  width: number | null;
};

export type Piece = {
  brand: string | null;
  categorySlug: string;
  code: string;
  condition: PieceCondition | null;
  createdAt: string;
  description: string;
  id: string;
  images: PieceImage[];
  name: string;
  priceCents: number;
  publishedAt: string | null;
  size: PieceSize;
  soldAt: string | null;
  status: PieceStatus;
  updatedAt: string;
};
