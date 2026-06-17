import { unstable_noStore as noStore } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { mapPiece } from "@/shared/server/mappers";
import type { Piece, PieceImageRow, PieceRow } from "@/shared/types";

type PieceWithImagesRow = PieceRow & {
  piece_images?: PieceImageRow[] | null;
};

const adminPieceSelect = `
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

export const getAdminPieces = async (): Promise<Piece[]> => {
  noStore();

  const client = await createClient();
  const { data, error } = await client
    .from("pieces")
    .select(adminPieceSelect)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data as PieceWithImagesRow[]).map((row) => mapPiece(client, row));
};

export const getAdminPiece = async (pieceId: string): Promise<Piece | null> => {
  noStore();

  const client = await createClient();
  const { data, error } = await client
    .from("pieces")
    .select(adminPieceSelect)
    .eq("id", pieceId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapPiece(client, data as PieceWithImagesRow) : null;
};
