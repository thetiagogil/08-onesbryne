import { PIECE_IMAGE_BUCKET } from "@/shared/constants/app";
import type {
  Category,
  CategoryRow,
  CategorySizeOption,
  CategorySizeOptionRow,
  Piece,
  PieceImage,
  PieceImageRow,
  PieceRow,
  PieceStatus,
  Profile,
  ProfileRow,
} from "@/shared/types";
import type { AppSupabaseClient } from "@/lib/supabase/schemas";

export const mapProfile = (row: ProfileRow): Profile => {
  return {
    appRole: row.app_role === "admin" ? "admin" : "customer",
    createdAt: row.created_at,
    displayName: row.display_name,
    id: row.id,
    updatedAt: row.updated_at,
  };
};

export const mapCategory = (row: CategoryRow): Category => {
  return {
    isActive: row.is_active,
    label: row.label,
    slug: row.slug,
    sortOrder: row.sort_order,
  };
};

export const mapCategorySizeOption = (
  row: CategorySizeOptionRow,
): CategorySizeOption => {
  return {
    categorySlug: row.category_slug,
    size: row.size,
    sortOrder: row.sort_order,
  };
};

export const mapPiece = (
  client: AppSupabaseClient,
  row: PieceRow & { piece_images?: PieceImageRow[] | null },
): Piece => {
  return {
    brand: row.brand,
    categorySlug: row.category_slug,
    code: row.code ?? `OB-${String(row.code_number).padStart(3, "0")}`,
    condition: row.condition_label,
    createdAt: row.created_at,
    description: row.description,
    id: row.id,
    images: (row.piece_images ?? [])
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((image) => mapPieceImage(client, image)),
    name: row.name,
    priceCents: row.price_cents,
    publishedAt: row.published_at,
    size: row.size_label,
    soldAt: row.sold_at,
    status: normalizePieceStatus(row.status),
    updatedAt: row.updated_at,
  };
};

export const mapPieceImage = (
  client: AppSupabaseClient,
  row: PieceImageRow,
): PieceImage => {
  const bucket = row.storage_bucket || PIECE_IMAGE_BUCKET;
  const publicUrl = client.storage.from(bucket).getPublicUrl(row.storage_path)
    .data.publicUrl;

  return {
    altText: row.alt_text,
    byteSize: row.byte_size,
    height: row.height,
    id: row.id,
    mimeType: row.mime_type,
    position: row.position,
    publicUrl,
    storageBucket: bucket,
    storagePath: row.storage_path,
    width: row.width,
  };
};

const normalizePieceStatus = (value: string): PieceStatus => {
  switch (value) {
    case "draft":
    case "available":
    case "reserved":
    case "sold":
    case "archived":
      return value;
    default:
      return "draft";
  }
};
