import type { ActionResult } from "@/shared/server/action-result";

export type ProfileSettingsInput = {
  displayName: string;
};

export function normalizeProfileSettingsFormData(
  formData: FormData,
): ActionResult<ProfileSettingsInput> {
  const displayName = formData.get("displayName");
  const value = typeof displayName === "string" ? displayName.trim() : "";

  if (!value) {
    return { ok: false, error: "Display name is required." };
  }

  if (value.length > 80) {
    return { ok: false, error: "Display name must be 80 characters or fewer." };
  }

  return { ok: true, data: { displayName: value } };
}
