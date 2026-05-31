import type { PieceStatus } from "@/shared/types";

export const pieceStatusOptions: { label: string; value: PieceStatus }[] = [
  { label: "Draft", value: "draft" },
  { label: "Available", value: "available" },
  { label: "Reserved", value: "reserved" },
  { label: "Sold", value: "sold" },
  { label: "Archived", value: "archived" },
];
