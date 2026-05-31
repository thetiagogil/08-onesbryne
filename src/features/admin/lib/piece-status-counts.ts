import type { Piece, PieceStatus } from "@/shared/types";

export function getPieceStatusCounts(pieces: Piece[]) {
  return pieces.reduce(
    (acc, piece) => {
      acc[piece.status] += 1;
      return acc;
    },
    {
      archived: 0,
      available: 0,
      draft: 0,
      reserved: 0,
      sold: 0,
    } satisfies Record<PieceStatus, number>,
  );
}
