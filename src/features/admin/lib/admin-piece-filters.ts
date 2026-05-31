import { pieceStatuses, type Piece, type PieceStatus } from "@/shared/types";

export type AdminPieceSort =
  | "newest"
  | "oldest"
  | "updated"
  | "price-asc"
  | "price-desc"
  | "name"
  | "code-asc"
  | "code-desc";

export type AdminPieceFilters = {
  category?: string;
  query?: string;
  sort: AdminPieceSort;
  status?: PieceStatus;
};

export type AdminPiecePageSize = 10 | 20;

export const adminPieceSortOptions: {
  label: string;
  value: AdminPieceSort;
}[] = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Recently updated", value: "updated" },
  { label: "Price low to high", value: "price-asc" },
  { label: "Price high to low", value: "price-desc" },
  { label: "Name A-Z", value: "name" },
  { label: "Code ascending", value: "code-asc" },
  { label: "Code descending", value: "code-desc" },
];

export const adminPieceStatusOptions = [
  { label: "All statuses", value: "" },
  { label: "Draft", value: "draft" },
  { label: "Available", value: "available" },
  { label: "Reserved", value: "reserved" },
  { label: "Sold", value: "sold" },
  { label: "Archived", value: "archived" },
];

export const adminPiecePageSizeOptions: {
  label: string;
  value: `${AdminPiecePageSize}`;
}[] = [
  { label: "10", value: "10" },
  { label: "20", value: "20" },
];

export const defaultAdminPieceFilters: AdminPieceFilters = {
  sort: "newest",
};

export const defaultAdminPiecePageSize: AdminPiecePageSize = 10;

export function hasActiveAdminPieceFilters(filters: AdminPieceFilters) {
  return Boolean(
    filters.category ||
    filters.query ||
    filters.status ||
    filters.sort !== "newest",
  );
}

export function filterAdminPieces(pieces: Piece[], filters: AdminPieceFilters) {
  const searchTerm = filters.query?.trim().toLowerCase();

  return sortAdminPieces(
    pieces.filter((piece) => {
      if (filters.status && piece.status !== filters.status) return false;
      if (filters.category && piece.categorySlug !== filters.category) {
        return false;
      }

      if (!searchTerm) return true;

      return [piece.name, piece.brand, piece.code].some((value) =>
        (value ?? "").toLowerCase().includes(searchTerm),
      );
    }),
    filters.sort,
  );
}

export function normalizeAdminPieceSort(value: string): AdminPieceSort {
  switch (value) {
    case "oldest":
    case "updated":
    case "price-asc":
    case "price-desc":
    case "name":
    case "code-asc":
    case "code-desc":
      return value;
    case "newest":
    default:
      return "newest";
  }
}

export function normalizeAdminPieceStatus(value: string) {
  return pieceStatuses.find((status) => status === value);
}

export function normalizeAdminPiecePageSize(value: string): AdminPiecePageSize {
  return value === "10" ? 10 : value === "20" ? 20 : defaultAdminPiecePageSize;
}

export function getAdminPiecePageCount(
  pieces: Piece[],
  pageSize: AdminPiecePageSize,
) {
  return Math.max(1, Math.ceil(pieces.length / pageSize));
}

export function paginateAdminPieces(
  pieces: Piece[],
  page: number,
  pageSize: AdminPiecePageSize,
) {
  const startIndex = (page - 1) * pageSize;

  return pieces.slice(startIndex, startIndex + pageSize);
}

function sortAdminPieces(pieces: Piece[], sort: AdminPieceSort) {
  return [...pieces].sort((left, right) => {
    switch (sort) {
      case "oldest":
        return left.createdAt.localeCompare(right.createdAt);
      case "updated":
        return right.updatedAt.localeCompare(left.updatedAt);
      case "price-asc":
        return left.priceCents - right.priceCents;
      case "price-desc":
        return right.priceCents - left.priceCents;
      case "name":
        return left.name.localeCompare(right.name);
      case "code-asc":
        return left.code.localeCompare(right.code, undefined, {
          numeric: true,
        });
      case "code-desc":
        return right.code.localeCompare(left.code, undefined, {
          numeric: true,
        });
      case "newest":
      default:
        return right.createdAt.localeCompare(left.createdAt);
    }
  });
}
