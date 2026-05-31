import { redirect } from "next/navigation";

import { AuthForm } from "@/features/auth/components/auth-form";
import {
  normalizeAuthMode,
  normalizeAuthNextPath,
} from "@/features/auth/lib/auth-routing";
import { normalizeQueryParam } from "@/features/catalog/lib/format";
import { isSupabaseConfigured } from "@/lib/env";
import { SiteShell } from "@/shared/components/layout/site-shell";
import { SetupMissing } from "@/shared/components/setup-missing";
import { getCurrentUser } from "@/shared/server/auth";

type AuthPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const params = await searchParams;
  const mode = normalizeAuthMode(normalizeQueryParam(params.mode));
  const next = normalizeAuthNextPath(normalizeQueryParam(params.next), "/");
  const initialError = normalizeQueryParam(params.error) ?? null;

  if (!isSupabaseConfigured()) {
    return <SetupMissing />;
  }

  const currentUser = await getCurrentUser();

  if (currentUser) {
    redirect(next);
  }

  return (
    <SiteShell currentUser={currentUser}>
      <AuthForm initialError={initialError} mode={mode} next={next} />
    </SiteShell>
  );
}
