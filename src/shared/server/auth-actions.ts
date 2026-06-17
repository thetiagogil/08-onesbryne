"use server";

import { revalidatePath } from "next/cache";

import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/shared/server/action-result";

export const signOutAction = async (): Promise<ActionResult> => {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured." };
  }

  try {
    const client = await createClient();
    const { error } = await client.auth.signOut();

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidatePath("/", "layout");

    return { ok: true, data: undefined };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Log out failed.",
    };
  }
};
