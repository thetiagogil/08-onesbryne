import { unstable_noStore as noStore } from "next/cache";

import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import {
  mapCategory,
  mapCategorySizeOption,
  mapPiece,
} from "@/shared/server/mappers";
import { sortPieceSizes } from "@/shared/constants/piece-attributes";
import type {
  Category,
  CategoryRow,
  CategorySizeOption,
  CategorySizeOptionRow,
  PieceImageRow,
  PieceRow,
  PieceSize,
} from "@/shared/types";

export type CatalogSort =
  | "newest"
  | "oldest"
  | "price-asc"
  | "price-desc"
  | "name";

export type CatalogFilters = {
  category?: string;
  query?: string;
  size?: string;
  sort?: CatalogSort;
};

type PieceWithImagesRow = PieceRow & {
  piece_images?: PieceImageRow[] | null;
};

const pieceSelect = `
  id,
  code,
  code_number,
  name,
  brand,
  category_slug,
  size_label,
  condition_label,
  price_cents,
  description,
  status,
  created_at,
  updated_at,
  published_at,
  sold_at,
  piece_images (
    id,
    piece_id,
    storage_bucket,
    storage_path,
    alt_text,
    position,
    width,
    height,
    byte_size,
    mime_type,
    created_at,
    updated_at
  )
`;

const visibleStatuses = ["available", "reserved", "sold"];

export async function getStorefrontData() {
  noStore();

  if (!isSupabaseConfigured()) {
    return { configured: false, pieces: [] };
  }

  const client = await createClient();
  const pieces = await client
    .from("pieces")
    .select(pieceSelect)
    .eq("status", "available")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(4);

  if (pieces.error) {
    throw new Error(pieces.error.message);
  }

  return {
    configured: true,
    pieces: (pieces.data as PieceWithImagesRow[]).map((row) =>
      mapPiece(client, row),
    ),
  };
}

export async function getCatalogData(filters: CatalogFilters) {
  noStore();

  if (!isSupabaseConfigured()) {
    return {
      activeCategory: undefined,
      activeSize: undefined,
      categories: [],
      configured: false,
      pieces: [],
      sizes: [],
    };
  }

  const client = await createClient();
  const categories = await getActiveCategories();
  const activeCategory = categories.some(
    (category) => category.slug === filters.category,
  )
    ? filters.category
    : undefined;
  const sizes = activeCategory
    ? (await getCategorySizeOptions(activeCategory)).map(
        (option) => option.size,
      )
    : await getAvailableSizes();
  const activeSize = sizes.includes(filters.size as PieceSize)
    ? (filters.size as PieceSize)
    : undefined;

  let query = client
    .from("pieces")
    .select(pieceSelect)
    .eq("status", "available");

  if (activeCategory) {
    query = query.eq("category_slug", activeCategory);
  }

  if (activeSize) {
    query = query.eq("size_label", activeSize);
  }

  const searchTerm = filters.query?.trim();
  if (searchTerm) {
    const escaped = searchTerm.replaceAll("%", "\\%").replaceAll(",", "\\,");
    query = query.or(
      `name.ilike.%${escaped}%,brand.ilike.%${escaped}%,code.ilike.%${escaped}%`,
    );
  }

  switch (filters.sort) {
    case "oldest":
      query = query.order("created_at", { ascending: true });
      break;
    case "price-asc":
      query = query.order("price_cents", { ascending: true });
      break;
    case "price-desc":
      query = query.order("price_cents", { ascending: false });
      break;
    case "name":
      query = query.order("name", { ascending: true });
      break;
    case "newest":
    default:
      query = query
        .order("published_at", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false });
      break;
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return {
    activeCategory,
    activeSize,
    categories,
    configured: true,
    pieces: (data as PieceWithImagesRow[]).map((row) => mapPiece(client, row)),
    sizes,
  };
}

export async function getPieceByCode(code: string) {
  noStore();

  if (!isSupabaseConfigured()) {
    return { configured: false, piece: null };
  }

  const client = await createClient();
  const { data, error } = await client
    .from("pieces")
    .select(pieceSelect)
    .eq("code", code)
    .in("status", visibleStatuses)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return {
    configured: true,
    piece: data ? mapPiece(client, data as PieceWithImagesRow) : null,
  };
}

export async function getFavouritePieceIds(userId: string | null | undefined) {
  noStore();

  if (!userId || !isSupabaseConfigured()) {
    return new Set<string>();
  }

  const client = await createClient();
  const { data, error } = await client
    .from("favourites")
    .select("piece_id")
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return new Set(data.map((row) => row.piece_id));
}

export async function getFavouritePieces(userId: string) {
  noStore();

  if (!isSupabaseConfigured()) {
    return { configured: false, pieces: [] };
  }

  const client = await createClient();
  const { data, error } = await client
    .from("favourites")
    .select(
      `
        piece_id,
        pieces (
          ${pieceSelect}
        )
      `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const pieces = data
    .map((row) => row.pieces)
    .filter(Boolean)
    .map((row) => mapPiece(client, row as PieceWithImagesRow));

  return { configured: true, pieces };
}

export async function getActiveCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) return [];

  const client = await createClient();
  const { data, error } = await client
    .from("categories")
    .select("slug, label, is_active, sort_order, created_at, updated_at")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("label", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data as CategoryRow[]).map(mapCategory);
}

export async function getCategorySizeOptions(
  categorySlug?: string,
): Promise<CategorySizeOption[]> {
  if (!isSupabaseConfigured()) return [];

  const client = await createClient();
  let query = client
    .from("category_size_options")
    .select("category_slug, size, sort_order, created_at, updated_at")
    .order("category_slug", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("size", { ascending: true });

  if (categorySlug) {
    query = query.eq("category_slug", categorySlug);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data as CategorySizeOptionRow[]).map(mapCategorySizeOption);
}

export async function getAvailableSizes(): Promise<PieceSize[]> {
  if (!isSupabaseConfigured()) return [];

  const client = await createClient();
  const { data, error } = await client
    .from("pieces")
    .select("size_label")
    .eq("status", "available")
    .order("size_label", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return sortPieceSizes(
    Array.from(new Set(data.map((row) => row.size_label).filter(Boolean))),
  );
}
