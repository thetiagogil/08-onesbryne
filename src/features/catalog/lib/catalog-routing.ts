import type { CatalogSort } from "@/features/catalog/server/queries";

export const normalizeCatalogSort = (
  value: string | undefined,
): CatalogSort => {
  switch (value) {
    case "oldest":
    case "price-asc":
    case "price-desc":
    case "name":
      return value;
    case "newest":
    default:
      return "newest";
  }
};

export const buildCatalogHref = ({
  category,
  query,
  size,
  sort,
}: {
  category?: string;
  query?: string;
  size?: string;
  sort: CatalogSort;
}) => {
  const params = new URLSearchParams();

  if (category) params.set("category", category);
  if (size) params.set("size", size);
  if (query) params.set("q", query);
  if (sort !== "newest") params.set("sort", sort);

  const queryString = params.toString();

  return queryString ? `/catalog?${queryString}` : "/catalog";
};
