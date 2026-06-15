"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pencil, Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { AdminPiecesFilters } from "@/features/admin/components/admin-pieces-filters";
import { AdminPieceStatusBadge } from "@/features/admin/components/admin-piece-status-badge";
import { AdminStat } from "@/features/admin/components/admin-stat";
import {
  defaultAdminPiecePageSize,
  defaultAdminPieceFilters,
  filterAdminPieces,
  getAdminPiecePageCount,
  hasActiveAdminPieceFilters,
  paginateAdminPieces,
  type AdminPieceFilters,
  type AdminPiecePageSize,
} from "@/features/admin/lib/admin-piece-filters";
import { getPieceStatusCounts } from "@/features/admin/lib/piece-status-counts";
import { formatCategoryLabel, formatPrice } from "@/features/catalog/lib/format";
import { EmptyState } from "@/shared/components/empty-state";
import { PageHeader } from "@/shared/components/page-header";
import { Button } from "@/shared/components/ui/button";
import { formatPieceSize } from "@/shared/constants/piece-attributes";
import type { Category, Piece } from "@/shared/types";

type AdminPiecesPageViewProps = {
  categories: Category[];
  pieces: Piece[];
};

export function AdminPiecesPageView({
  categories,
  pieces,
}: AdminPiecesPageViewProps) {
  const [filters, setFilters] = useState(defaultAdminPieceFilters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultAdminPiecePageSize);
  const counts = getPieceStatusCounts(pieces);
  const filteredPieces = useMemo(
    () => filterAdminPieces(pieces, filters),
    [filters, pieces],
  );
  const pageCount = getAdminPiecePageCount(filteredPieces, pageSize);
  const currentPage = Math.min(page, pageCount);
  const visiblePieces = useMemo(
    () => paginateAdminPieces(filteredPieces, currentPage, pageSize),
    [currentPage, filteredPieces, pageSize],
  );
  const firstVisiblePiece = filteredPieces.length
    ? (currentPage - 1) * pageSize + 1
    : 0;
  const lastVisiblePiece = Math.min(
    currentPage * pageSize,
    filteredPieces.length,
  );
  const hasFilters = hasActiveAdminPieceFilters(filters);

  function handleFiltersChange(nextFilters: AdminPieceFilters) {
    setFilters(nextFilters);
    setPage(1);
  }

  function handleClearFilters() {
    setFilters(defaultAdminPieceFilters);
    setPage(1);
  }

  function handlePageSizeChange(nextPageSize: AdminPiecePageSize) {
    setPageSize(nextPageSize);
    setPage(1);
  }

  function handlePreviousPage() {
    setPage((current) => Math.max(1, current - 1));
  }

  function handleNextPage() {
    setPage((current) => Math.min(pageCount, current + 1));
  }

  return (
    <section className="mx-auto max-w-400 px-4 py-16 md:px-6 lg:px-10">
      <PageHeader
        actions={
          <Button asChild>
            <Link href="/admin/pieces/new">
              <Plus />
              New piece
            </Link>
          </Button>
        }
        description="Manage catalog entries, availability, pricing, and images."
        title="The atelier"
      />

      <div className="mt-12 grid gap-px border border-hairline bg-hairline sm:grid-cols-4">
        <AdminStat label="Available" value={counts.available} />
        <AdminStat label="Drafts" value={counts.draft} />
        <AdminStat label="Sold" value={counts.sold} />
        <AdminStat label="Archived" value={counts.archived} />
      </div>

      <AdminPiecesFilters
        canClear={hasFilters}
        categories={categories}
        filters={filters}
        onClear={handleClearFilters}
        onFiltersChange={handleFiltersChange}
        onPageSizeChange={handlePageSizeChange}
        pageSize={pageSize}
      />

      <div className="mt-6 text-[11px] tracking-eyebrow text-muted-foreground uppercase">
        Showing {firstVisiblePiece}-{lastVisiblePiece} of{" "}
        {filteredPieces.length}{" "}
        {filteredPieces.length === 1 ? "piece" : "pieces"}
        {hasFilters ? ` from ${pieces.length} total` : null}
      </div>

      <div className="mt-4 overflow-x-auto border border-hairline">
        <table className="min-w-[980px] w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-hairline text-[10px] tracking-eyebrow text-muted-foreground uppercase">
              <th className="px-6 py-4 font-medium">Image</th>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Code</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Size</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody>
            {visiblePieces.length ? (
              visiblePieces.map((piece) => (
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
                    {formatCategoryLabel(piece.categorySlug)}
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
                  className="px-6 py-8"
                  colSpan={8}
                >
                  <EmptyState
                    actionHref={hasFilters ? undefined : "/admin/pieces/new"}
                    actionLabel={hasFilters ? undefined : "Create piece"}
                    description={
                      hasFilters
                        ? "Adjust the local filters or clear them to see the full inventory."
                        : "Create the first catalog entry with a compressed image."
                    }
                    title={
                      hasFilters
                        ? "No pieces match those filters."
                        : "No pieces yet."
                    }
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-[11px] tracking-eyebrow text-muted-foreground uppercase">
        <span>
          Page {currentPage} of {pageCount}
        </span>
        <div className="flex items-center gap-3">
          <Button
            disabled={currentPage <= 1}
            onClick={handlePreviousPage}
            size="sm"
            type="button"
            variant="outline"
          >
            <ChevronLeft />
            Previous
          </Button>
          <Button
            disabled={currentPage >= pageCount}
            onClick={handleNextPage}
            size="sm"
            type="button"
            variant="outline"
          >
            Next
            <ChevronRight />
          </Button>
        </div>
      </div>
    </section>
  );
}
