import type { AuthMode } from "@/features/auth/types";
import { safeRedirectPath } from "@/lib/routing/redirect";

const authRoutePathnames = new Set(["/auth", "/login", "/signup"]);

export const getAuthModeHref = (
  mode: AuthMode,
  next: string,
  error?: string | null,
) => {
  const params = new URLSearchParams();

  if (mode === "signup") {
    params.set("mode", "signup");
  }

  if (next !== "/") {
    params.set("next", next);
  }

  if (error) {
    params.set("error", error);
  }

  const queryString = params.toString();

  return queryString ? `/auth?${queryString}` : "/auth";
};

export const normalizeAuthNextPath = (
  value: string | null | undefined,
  fallback = "/",
) => {
  const next = safeRedirectPath(value, fallback);

  if (isAuthPathname(next)) {
    return fallback;
  }

  return next;
};

export const normalizeAuthMode = (value: string | undefined): AuthMode => {
  return value === "signup" ? "signup" : "login";
};

function isAuthPathname(value: string) {
  const pathname = value.split(/[?#]/, 1)[0] ?? value;

  return authRoutePathnames.has(pathname) || pathname.startsWith("/auth/");
}
