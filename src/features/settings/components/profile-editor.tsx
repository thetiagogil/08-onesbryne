"use client";

import { Pencil, X } from "lucide-react";
import { useState } from "react";

import { ProfileSettingsForm } from "@/features/settings/components/profile-settings-form";
import { SectionHeader } from "@/shared/components/section-header";
import type { CurrentUser } from "@/shared/types";

type ProfileEditorProps = {
  currentUser: CurrentUser;
};

export function ProfileEditor({ currentUser }: ProfileEditorProps) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="space-y-4">
      <button
        className="focus-soft flex w-full items-center gap-2 border border-hairline px-6 py-4 text-left text-[11px] tracking-eyebrow uppercase transition-colors hover:border-accent hover:text-accent"
        onClick={() => setEditing((value) => !value)}
        type="button"
      >
        {editing ? <X className="size-3.5" /> : <Pencil className="size-3.5" />}
        {editing ? "Cancel profile edit" : "Edit profile"}
      </button>

      {editing ? (
        <div className="border border-hairline px-6 py-6">
          <SectionHeader
            description="This name appears in your account and internal profile."
            title="Profile details"
          />
          <ProfileSettingsForm currentUser={currentUser} />
        </div>
      ) : null}
    </div>
  );
}
