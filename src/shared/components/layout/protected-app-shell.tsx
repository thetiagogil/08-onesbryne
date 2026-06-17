import type { ReactNode } from "react";

import { SiteShell } from "@/shared/components/layout/site-shell";
import type { CurrentUser } from "@/shared/types";

type ProtectedAppShellProps = {
  children: ReactNode;
  currentUser: CurrentUser;
};

export const ProtectedAppShell = ({
  children,
  currentUser,
}: ProtectedAppShellProps) => {
  return <SiteShell currentUser={currentUser}>{children}</SiteShell>;
};
