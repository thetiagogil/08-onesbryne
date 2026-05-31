"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { requireAuthUser } from "@/shared/server/auth";

export async function toggleFavouriteAction(
  pieceId: string,
  returnPath: string,
) {
  const client = await createClient();
  const user = await requireAuthUser(client);

  const { data: existing, error: readError } = await client
    .from("favourites")
    .select("piece_id")
    .eq("user_id", user.id)
    .eq("piece_id", pieceId)
    .maybeSingle();

  if (readError) {
    throw new Error(readError.message);
  }

  if (existing) {
    const { error } = await client
      .from("favourites")
      .delete()
      .eq("user_id", user.id)
      .eq("piece_id", pieceId);

    if (error) throw new Error(error.message);
  } else {
    const { error } = await client.from("favourites").insert({
      piece_id: pieceId,
      user_id: user.id,
    });

    if (error) throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/favourites");
  revalidatePath(returnPath);
}

export async function redirectToAuthForFavourite(returnPath: string) {
  redirect(`/auth?next=${encodeURIComponent(returnPath)}`);
}
