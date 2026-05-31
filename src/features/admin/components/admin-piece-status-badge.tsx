import { Badge } from "@/shared/components/ui/badge";
import type { PieceStatus } from "@/shared/types";

type AdminPieceStatusBadgeProps = {
  status: PieceStatus;
};

export function AdminPieceStatusBadge({
  status,
}: AdminPieceStatusBadgeProps) {
  if (status === "available") return <Badge tone="accent">Available</Badge>;
  if (status === "draft") return <Badge>Draft</Badge>;
  if (status === "sold") return <Badge>Sold</Badge>;
  if (status === "reserved") return <Badge tone="accent">Reserved</Badge>;

  return <Badge>Archived</Badge>;
}
