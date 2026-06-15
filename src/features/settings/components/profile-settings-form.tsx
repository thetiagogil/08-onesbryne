"use client";

import { useActionState } from "react";

import { ProfileSettingsSubmitButton } from "@/features/settings/components/profile-settings-submit-button";
import {
  updateProfileSettingsAction,
  type ProfileSettingsState,
} from "@/features/settings/server/actions";
import { FormFeedback } from "@/shared/components/form-feedback";
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
        <FormFeedback tone="error">{state.error}</FormFeedback>
      ) : null}
      {state?.ok && state.message ? (
        <FormFeedback tone="success">{state.message}</FormFeedback>
      ) : null}

      <FormField htmlFor="displayName" label="Name" required>
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
