"use client";

import { useActionState } from "react";

import { ProfileSettingsSubmitButton } from "@/features/settings/components/profile-settings-submit-button";
import {
  updateProfileSettingsAction,
  type ProfileSettingsState,
} from "@/features/settings/server/actions";
import { FormField } from "@/shared/components/form-field";
import { Input } from "@/shared/components/ui/input";
import type { CurrentUser } from "@/shared/types";

type ProfileSettingsFormProps = {
  currentUser: CurrentUser;
};

export function ProfileSettingsForm({ currentUser }: ProfileSettingsFormProps) {
  const [state, formAction] = useActionState<ProfileSettingsState, FormData>(
    updateProfileSettingsAction,
    null,
  );

  return (
    <form action={formAction} className="mt-6 space-y-6">
      {state && !state.ok ? (
        <div className="border border-destructive/40 px-4 py-3 text-sm text-destructive">
          {state.error}
        </div>
      ) : null}
      {state?.ok && state.message ? (
        <div className="border border-accent/40 px-4 py-3 text-sm text-accent">
          {state.message}
        </div>
      ) : null}

      <FormField htmlFor="displayName" label="Display name" required>
        <Input
          defaultValue={currentUser.profile.displayName ?? ""}
          id="displayName"
          maxLength={80}
          name="displayName"
          required
        />
      </FormField>

      <ProfileSettingsSubmitButton />
    </form>
  );
}
