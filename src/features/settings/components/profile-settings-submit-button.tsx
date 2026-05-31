"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button } from "@/shared/components/ui/button";

export function ProfileSettingsSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit">
      {pending ? <Loader2 className="animate-spin" /> : null}
      Save profile
    </Button>
  );
}
