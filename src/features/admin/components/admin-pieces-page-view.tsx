import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";

import { AdminPieceStatusBadge } from "@/features/admin/components/admin-piece-status-badge";
import { AdminStat } from "@/features/admin/components/admin-stat";
import { getPieceStatusCounts } from "@/features/admin/lib/piece-status-counts";
import { formatPrice } from "@/features/catalog/lib/format";
import { Button } from "@/shared/components/ui/button";
import { formatPieceSize } from "@/shared/constants/piece-attributes";
import type { Piece } from "@/shared/types";

type AdminPiecesPageViewProps = {
  pieces: Piece[];
};

export function AdminPiecesPageView({ pieces }: AdminPiecesPageViewProps) {
  const counts = getPieceStatusCounts(pieces);

  return (
    <section className="mx-auto max-w-400 px-4 py-16 md:px-6 lg:px-10">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl md:text-6xl">The atelier</h1>
        </div>
        <Button asChild>
          <Link href="/admin/pieces/new">
            <Plus />
            New piece
          </Link>
        </Button>
      </div>

      <div className="mt-12 grid gap-px border border-hairline bg-hairline sm:grid-cols-4">
        <AdminStat label="Available" value={counts.available} />
        <AdminStat label="Drafts" value={counts.draft} />
        <AdminStat label="Sold" value={counts.sold} />
        <AdminStat label="Archived" value={counts.archived} />
      </div>

      <div className="mt-10 overflow-x-auto border border-hairline">
        <table className="min-w-[860px] w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-hairline text-[10px] tracking-eyebrow text-muted-foreground uppercase">
              <th className="px-6 py-4 font-medium">Image</th>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Code</th>
              <th className="px-6 py-4 font-medium">Size</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody>
            {pieces.length ? (
              pieces.map((piece) => (
                <tr
                  className="border-b border-hairline transition-colors hover:bg-surface"
                  key={piece.id}
                >
                  <td className="px-6 py-4">
                    <Link
                      className="relative block aspect-square w-16 overflow-hidden bg-surface"
                      href={`/pieces/${piece.code}`}
                    >
                      {piece.images[0] ? (
                        <Image
                          alt=""
                          className="h-full w-full object-cover"
                          fill
                          sizes="64px"
                          src={piece.images[0].publicUrl}
                        />
                      ) : null}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-display text-base">{piece.name}</div>
                    {piece.brand ? (
                      <div className="text-xs text-muted-foreground">
                        {piece.brand}
                      </div>
                    ) : null}
                  </td>
                  <td className="px-6 py-4 text-xs tracking-eyebrow text-muted-foreground uppercase">
                    {piece.code}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {formatPieceSize(piece.size)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {formatPrice(piece.priceCents)}
                  </td>
                  <td className="px-6 py-4">
                    <AdminPieceStatusBadge status={piece.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button asChild size="icon" variant="ghost">
                      <Link
                        aria-label={`Edit ${piece.code}`}
                        href={`/admin/pieces/${piece.id}/edit`}
                      >
                        <Pencil />
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="px-6 py-16 text-center text-sm text-muted-foreground"
                  colSpan={7}
                >
                  No pieces yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
