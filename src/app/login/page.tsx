import { redirect } from "next/navigation";

import {
  getAuthModeHref,
  normalizeAuthNextPath,
} from "@/features/auth/lib/auth-routing";
import { normalizeQueryParam } from "@/features/catalog/lib/format";

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = normalizeAuthNextPath(normalizeQueryParam(params.next), "/");
  const error = normalizeQueryParam(params.error) ?? null;

  redirect(getAuthModeHref("login", next, error));
}
