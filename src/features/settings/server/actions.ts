"use server";

import { revalidatePath } from "next/cache";

import { normalizeProfileSettingsFormData } from "@/features/settings/lib/profile-validation";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/shared/server/action-result";
import { requireAuthUser } from "@/shared/server/auth";

export type ProfileSettingsState = ActionResult | null;

export async function updateProfileSettingsAction(
  _previousState: ProfileSettingsState,
  formData: FormData,
): Promise<ProfileSettingsState> {
  const normalized = normalizeProfileSettingsFormData(formData);

  if (!normalized.ok) return normalized;

  const client = await createClient();
  const user = await requireAuthUser(client);

  const { error } = await client
    .from("profiles")
    .update({ display_name: normalized.data.displayName })
    .eq("id", user.id);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/", "layout");
  revalidatePath("/account");

  return { ok: true, data: undefined, message: "Profile saved." };
}
