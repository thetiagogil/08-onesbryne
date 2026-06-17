"use server";

import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  isAcceptedPieceImageMimeType,
  normalizeCreatePieceImageFormData,
  normalizePieceFormData,
  type PieceFormInput,
} from "@/features/admin/lib/piece-validation";
import { buildPieceImageStoragePath } from "@/features/admin/lib/piece-image-storage";
import {
  MAX_IMAGE_BYTES,
  PIECE_IMAGE_BUCKET,
  type PieceImageMimeType,
} from "@/shared/constants/app";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/shared/server/action-result";
import { requireAdminAuthUser } from "@/shared/server/auth";

export type PieceFormState = ActionResult<{ id: string }> | null;

type ServerSupabaseClient = Awaited<ReturnType<typeof createClient>>;

export const createPieceAction = async (
  _previousState: PieceFormState,
  formData: FormData,
): Promise<PieceFormState> => {
  const normalized = normalizePieceFormData(formData);

  if (!normalized.ok) return normalized;

  const image = normalizeCreatePieceImageFormData(formData);

  if (!image.ok) return image;

  const client = await createClient();
  await requireAdminAuthUser(client);

  const categorySize = await ensureCategorySizeAllowed(client, normalized.data);

  if (!categorySize.ok) return categorySize;

  const { data, error } = await client
    .from("pieces")
    .insert(toPieceWrite(normalized.data))
    .select("id")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message ?? "Could not create piece." };
  }

  const storagePath = buildPieceImageStoragePath({
    originalName: image.data.file.name,
    pieceId: data.id,
    uniqueId: randomUUID(),
  });
  const { error: uploadError } = await client.storage
    .from(PIECE_IMAGE_BUCKET)
    .upload(storagePath, image.data.file, {
      cacheControl: "31536000",
      contentType: image.data.mimeType,
      upsert: false,
    });

  if (uploadError) {
    const rollbackErrors = await rollbackCreatedPiece(client, data.id);
    return {
      ok: false,
      error: withRollbackMessage(uploadError.message, rollbackErrors),
    };
  }

  const imageResult = await insertPieceImageMetadata(client, {
    altText: normalized.data.name,
    byteSize: image.data.byteSize,
    height: image.data.height,
    mimeType: image.data.mimeType,
    pieceId: data.id,
    position: 0,
    storagePath,
    width: image.data.width,
  });

  if (!imageResult.ok) {
    const rollbackErrors = await rollbackCreatedPiece(
      client,
      data.id,
      storagePath,
    );
    return {
      ok: false,
      error: withRollbackMessage(imageResult.error, rollbackErrors),
    };
  }

  revalidateAdminSurfaces();
  redirect(`/admin/pieces/${data.id}/edit`);
};

export const updatePieceAction = async (
  pieceId: string,
  _previousState: PieceFormState,
  formData: FormData,
): Promise<PieceFormState> => {
  const normalized = normalizePieceFormData(formData);

  if (!normalized.ok) return normalized;

  const client = await createClient();
  await requireAdminAuthUser(client);

  const categorySize = await ensureCategorySizeAllowed(client, normalized.data);

  if (!categorySize.ok) return categorySize;

  const { data: existing, error: readError } = await client
    .from("pieces")
    .select("published_at, sold_at")
    .eq("id", pieceId)
    .single();

  if (readError || !existing) {
    return { ok: false, error: readError?.message ?? "Piece not found." };
  }

  const { error } = await client
    .from("pieces")
    .update(
      toPieceWrite(normalized.data, {
        existingPublishedAt: existing.published_at,
        existingSoldAt: existing.sold_at,
      }),
    )
    .eq("id", pieceId);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidateAdminSurfaces();

  return {
    ok: true,
    data: { id: pieceId },
    message: "Piece saved.",
  };
};

export const archivePieceAction = async (pieceId: string) => {
  const client = await createClient();
  await requireAdminAuthUser(client);

  const { error } = await client
    .from("pieces")
    .update({ status: "archived" })
    .eq("id", pieceId);

  if (error) throw new Error(error.message);

  revalidateAdminSurfaces();
};

export type AddPieceImageInput = {
  altText?: string | null;
  byteSize: number;
  height: number | null;
  mimeType: PieceImageMimeType;
  pieceId: string;
  storagePath: string;
  width: number | null;
};

export const addPieceImageAction = async (
  input: AddPieceImageInput,
): Promise<ActionResult<{ id: string }>> => {
  const client = await createClient();
  await requireAdminAuthUser(client);

  if (input.byteSize > MAX_IMAGE_BYTES) {
    return { ok: false, error: "Image must be 3 MiB or smaller." };
  }

  if (!isAcceptedPieceImageMimeType(input.mimeType)) {
    return { ok: false, error: "Only WebP and JPEG images are allowed." };
  }

  const { count, error: countError } = await client
    .from("piece_images")
    .select("id", { count: "exact", head: true })
    .eq("piece_id", input.pieceId);

  if (countError) {
    return { ok: false, error: countError.message };
  }

  const result = await insertPieceImageMetadata(client, {
    ...input,
    position: count ?? 0,
  });

  if (!result.ok) return result;

  revalidateAdminSurfaces();
  revalidatePath(`/admin/pieces/${input.pieceId}/edit`);

  return result;
};

export const deletePieceImageAction = async (
  pieceId: string,
  imageId: string,
  storagePath: string,
): Promise<ActionResult> => {
  const client = await createClient();
  await requireAdminAuthUser(client);

  const { count, error: countError } = await client
    .from("piece_images")
    .select("id", { count: "exact", head: true })
    .eq("piece_id", pieceId);

  if (countError) {
    return { ok: false, error: countError.message };
  }

  if ((count ?? 0) <= 1) {
    return {
      ok: false,
      error: "Every piece needs at least one image.",
    };
  }

  const { error: storageError } = await client.storage
    .from(PIECE_IMAGE_BUCKET)
    .remove([storagePath]);

  if (storageError) {
    return { ok: false, error: storageError.message };
  }

  const { error } = await client
    .from("piece_images")
    .delete()
    .eq("id", imageId)
    .eq("piece_id", pieceId);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidateAdminSurfaces();
  revalidatePath(`/admin/pieces/${pieceId}/edit`);

  return { ok: true, data: undefined };
};

function toPieceWrite(
  input: PieceFormInput,
  existing?: {
    existingPublishedAt: string | null;
    existingSoldAt: string | null;
  },
) {
  const now = new Date().toISOString();

  return {
    brand: input.brand,
    category_slug: input.categorySlug,
    condition_label: input.condition,
    description: input.description,
    name: input.name,
    price_cents: input.priceCents,
    published_at:
      input.status === "available"
        ? (existing?.existingPublishedAt ?? now)
        : existing?.existingPublishedAt,
    size_label: input.size,
    sold_at: input.status === "sold" ? (existing?.existingSoldAt ?? now) : null,
    status: input.status,
  };
}

function revalidateAdminSurfaces() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/pieces");
}

async function ensureCategorySizeAllowed(
  client: ServerSupabaseClient,
  input: PieceFormInput,
): Promise<ActionResult> {
  const { data, error } = await client
    .from("category_size_options")
    .select("size")
    .eq("category_slug", input.categorySlug)
    .eq("size", input.size)
    .maybeSingle();

  if (error) {
    return { ok: false, error: error.message };
  }

  if (!data) {
    return {
      ok: false,
      error: "Size is not available for the selected category.",
    };
  }

  return { ok: true, data: undefined };
}

type PieceImageMetadataInput = {
  altText?: string | null;
  byteSize: number;
  height: number | null;
  mimeType: PieceImageMimeType;
  pieceId: string;
  position: number;
  storagePath: string;
  width: number | null;
};

async function insertPieceImageMetadata(
  client: ServerSupabaseClient,
  input: PieceImageMetadataInput,
): Promise<ActionResult<{ id: string }>> {
  const { data, error } = await client
    .from("piece_images")
    .insert({
      alt_text: input.altText?.trim() || null,
      byte_size: input.byteSize,
      height: input.height,
      mime_type: input.mimeType,
      piece_id: input.pieceId,
      position: input.position,
      storage_bucket: PIECE_IMAGE_BUCKET,
      storage_path: input.storagePath,
      width: input.width,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message ?? "Could not save image." };
  }

  return { ok: true, data: { id: data.id } };
}

async function rollbackCreatedPiece(
  client: ServerSupabaseClient,
  pieceId: string,
  storagePath?: string,
) {
  const errors: string[] = [];

  if (storagePath) {
    const { error } = await client.storage
      .from(PIECE_IMAGE_BUCKET)
      .remove([storagePath]);

    if (error) errors.push(error.message);
  }

  const { error } = await client.from("pieces").delete().eq("id", pieceId);
  if (error) errors.push(error.message);

  return errors;
}

function withRollbackMessage(error: string, rollbackErrors: string[]) {
  if (!rollbackErrors.length) return error;

  return `${error} Rollback failed: ${rollbackErrors.join(" ")}`;
}
