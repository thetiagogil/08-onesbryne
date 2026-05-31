import type { User } from "@supabase/supabase-js";
import { notFound, redirect } from "next/navigation";

import { isSupabaseConfigured } from "@/lib/env";
import { safeRedirectPath } from "@/lib/routing/redirect";
import type { AppSupabaseClient } from "@/lib/supabase/schemas";
import { createClient } from "@/lib/supabase/server";
import { mapProfile } from "@/shared/server/mappers";
import type { CurrentUser, ProfileRow } from "@/shared/types";

export class AuthRequiredError extends Error {
  constructor() {
    super("Authentication required.");
    this.name = "AuthRequiredError";
  }
}

export class AdminRequiredError extends Error {
  constructor() {
    super("Admin access required.");
    this.name = "AdminRequiredError";
  }
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (!isSupabaseConfigured()) return null;

  const client = await createClient();
  const user = await getCurrentAuthUser(client);

  if (!user) return null;

  const profile = await ensureProfileForAuthUser(client, user);

  return {
    email: user.email ?? null,
    id: user.id,
    profile: mapProfile(profile),
  };
}

export async function requireUser(next = "/") {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect(`/auth?next=${encodeURIComponent(safeRedirectPath(next, "/"))}`);
  }

  return currentUser;
}

export async function requireAdmin() {
  const currentUser = await requireUser("/admin");

  if (currentUser.profile.appRole !== "admin") {
    notFound();
  }

  return currentUser;
}

export async function requireAuthUser(client: AppSupabaseClient) {
  const user = await getCurrentAuthUser(client);

  if (!user) {
    throw new AuthRequiredError();
  }

  return user;
}

export async function requireAdminAuthUser(client: AppSupabaseClient) {
  const user = await requireAuthUser(client);
  const profile = await readProfile(client, user.id);

  if (profile?.app_role !== "admin") {
    throw new AdminRequiredError();
  }

  return user;
}

export async function getCurrentAuthUser(client: AppSupabaseClient) {
  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  if (error) return null;

  return user;
}

async function ensureProfileForAuthUser(
  client: AppSupabaseClient,
  user: User,
): Promise<ProfileRow> {
  const existing = await readProfile(client, user.id);

  if (existing) return existing;

  const { data, error } = await client
    .from("profiles")
    .insert({
      display_name: getProfileDisplayName(user),
      id: user.id,
    })
    .select("id, display_name, app_role, created_at, updated_at")
    .single();

  if (!error && data) return data;

  if (error?.code === "23505") {
    const racedProfile = await readProfile(client, user.id);
    if (racedProfile) return racedProfile;
  }

  throw new Error(error?.message ?? "Could not create profile.");
}

async function readProfile(
  client: AppSupabaseClient,
  userId: string,
): Promise<ProfileRow | null> {
  const { data, error } = await client
    .from("profiles")
    .select("id, display_name, app_role, created_at, updated_at")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

function getProfileDisplayName(user: User) {
  const metadata = isRecord(user.user_metadata) ? user.user_metadata : {};
  const emailName = user.email?.split("@")[0]?.replace(/[._-]+/g, " ");

  return (
    readString(metadata.display_name) ??
    readString(metadata.full_name) ??
    readString(metadata.name) ??
    titleCase(emailName) ??
    "Onesbryne customer"
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function titleCase(value: string | null | undefined) {
  if (!value?.trim()) return null;

  return value
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
