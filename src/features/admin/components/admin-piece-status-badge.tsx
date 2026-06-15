import { Badge } from "@/shared/components/ui/badge";
import { formatPieceStatus } from "@/shared/constants/piece-attributes";
import type { PieceStatus } from "@/shared/types";

type AdminPieceStatusBadgeProps = {
  status: PieceStatus;
};

export function AdminPieceStatusBadge({
  status,
}: AdminPieceStatusBadgeProps) {
  if (status === "available" || status === "reserved") {
    return <Badge tone="accent">{formatPieceStatus(status)}</Badge>;
  }

  return <Badge>{formatPieceStatus(status)}</Badge>;
}
