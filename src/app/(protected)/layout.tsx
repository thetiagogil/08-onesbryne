import type { ReactNode } from "react";
import { headers } from "next/headers";

import { ProtectedAppShell } from "@/shared/components/layout/protected-app-shell";
import { requireUser } from "@/shared/server/auth";

type ProtectedLayoutProps = {
  children: ReactNode;
};

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const headerStore = await headers();
  const nextPath = headerStore.get("x-onesbryne-pathname") ?? "/";
  const currentUser = await requireUser(nextPath);

  return (
    <ProtectedAppShell currentUser={currentUser}>{children}</ProtectedAppShell>
  );
}
