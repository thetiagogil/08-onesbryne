import type { CatalogSort } from "@/features/catalog/server/queries";

export const catalogSortOptions: { label: string; value: CatalogSort }[] = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Price up", value: "price-asc" },
  { label: "Price down", value: "price-desc" },
  { label: "Name", value: "name" },
];
