import { Search } from "lucide-react";

import { CategoryFilterLink } from "@/features/catalog/components/category-filter-link";
import { catalogSortOptions } from "@/features/catalog/lib/catalog-sort-options";
import type { CatalogSort } from "@/features/catalog/server/queries";
import { FormField } from "@/shared/components/form-field";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Select } from "@/shared/components/ui/select";
import { formatPieceSize } from "@/shared/constants/piece-attributes";
import type { Category, PieceSize } from "@/shared/types";

type CatalogFiltersProps = {
  categories: Category[];
  currentCategory?: string;
  currentSize?: string;
  query?: string;
  sort: CatalogSort;
  sizes: PieceSize[];
};

export function CatalogFilters({
  categories,
  currentCategory,
  currentSize,
  query,
  sort,
  sizes,
}: CatalogFiltersProps) {
  const sizeOptions = [
    { label: "All", value: "" },
    ...sizes.map((size) => ({
      label: formatPieceSize(size),
      value: size,
    })),
  ];

  return (
    <>
      <section className="mx-auto max-w-400 px-4 pb-6 md:px-6 lg:px-10">
        <div className="flex flex-wrap gap-2">
          <CategoryFilterLink
            active={!currentCategory}
            label="All"
            query={query}
            sort={sort}
          />
          {categories.map((category) => (
            <CategoryFilterLink
              active={currentCategory === category.slug}
              key={category.slug}
              label={category.label}
              query={query}
              slug={category.slug}
              sort={sort}
            />
          ))}
        </div>
      </section>

      <section className="sticky top-16 z-30 border-y border-hairline bg-background/90 backdrop-blur-md">
        <form className="mx-auto flex max-w-400 flex-wrap items-end gap-x-6 gap-y-3 px-4 py-4 md:px-6 lg:px-10">
          {currentCategory ? (
            <input name="category" type="hidden" value={currentCategory} />
          ) : null}
          <FormField htmlFor="size" label="Size">
            <Select
              defaultValue={currentSize ?? ""}
              id="size"
              name="size"
              options={sizeOptions}
            />
          </FormField>
          <FormField htmlFor="sort" label="Sort">
            <Select
              defaultValue={sort}
              id="sort"
              name="sort"
              options={catalogSortOptions}
            />
          </FormField>
          <label className="min-w-56 flex-1 space-y-1 sm:max-w-xs">
            <span className="block text-[10px] tracking-eyebrow text-muted-foreground uppercase">
              Search
            </span>
            <Input
              defaultValue={query}
              name="q"
              placeholder="Name, brand, or code"
              type="search"
            />
          </label>
          <Button size="sm" type="submit" variant="outline">
            <Search />
            Apply
          </Button>
        </form>
      </section>
    </>
  );
}
