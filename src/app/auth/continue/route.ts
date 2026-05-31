import { NextResponse, type NextRequest } from "next/server";

import {
  getAuthModeHref,
  normalizeAuthNextPath,
} from "@/features/auth/lib/auth-routing";
import { getCurrentUser } from "@/shared/server/auth";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const next = normalizeAuthNextPath(requestUrl.searchParams.get("next"), "/");
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.redirect(
      new URL(getAuthModeHref("login", next), requestUrl.origin),
    );
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
