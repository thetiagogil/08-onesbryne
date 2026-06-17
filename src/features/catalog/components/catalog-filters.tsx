"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { CategoryFilterLink } from "@/features/catalog/components/category-filter-link";
import {
  buildCatalogHref,
  normalizeCatalogSort,
} from "@/features/catalog/lib/catalog-routing";
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

export const CatalogFilters = ({
  categories,
  currentCategory,
  currentSize,
  query,
  sort,
  sizes,
}: CatalogFiltersProps) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(query ?? "");
  const hasFilters = Boolean(
    currentCategory || currentSize || query || sort !== "newest",
  );
  const sizeOptions = [
    { label: "All", value: "" },
    ...sizes.map((size) => ({
      label: formatPieceSize(size),
      value: size,
    })),
  ];

  useEffect(() => {
    const nextQuery = searchValue.trim() || undefined;

    if ((query ?? "") === (nextQuery ?? "")) return;

    const timeout = window.setTimeout(() => {
      startTransition(() => {
        router.replace(
          buildCatalogHref({
            category: currentCategory,
            query: nextQuery,
            size: currentSize,
            sort,
          }),
          { scroll: false },
        );
      });
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [currentCategory, currentSize, query, router, searchValue, sort]);

  const updateCatalogUrl = (next: {
    query?: string;
    size?: string;
    sort?: CatalogSort;
  }) => {
    startTransition(() => {
      router.replace(
        buildCatalogHref({
          category: currentCategory,
          query,
          size: currentSize,
          sort,
          ...next,
        }),
        { scroll: false },
      );
    });
  };

  const clearCatalogFilters = () => {
    startTransition(() => {
      router.replace("/catalog", { scroll: false });
    });
  };

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

      <section className="border-hairline bg-background/90 sticky top-16 z-30 border-y backdrop-blur-md">
        <div className="mx-auto grid max-w-400 gap-x-6 gap-y-4 px-4 py-4 sm:grid-cols-2 md:px-6 lg:grid-cols-[minmax(8rem,10rem)_minmax(9rem,11rem)_minmax(16rem,1fr)_auto_auto] lg:items-end lg:px-10">
          <FormField htmlFor="size" label="Size">
            <Select
              id="size"
              name="size"
              onValueChange={(value) =>
                updateCatalogUrl({ size: value || undefined })
              }
              options={sizeOptions}
              value={currentSize ?? ""}
            />
          </FormField>
          <FormField htmlFor="sort" label="Sort">
            <Select
              id="sort"
              name="sort"
              onValueChange={(value) =>
                updateCatalogUrl({
                  sort: normalizeCatalogSort(value),
                })
              }
              options={catalogSortOptions}
              value={sort}
            />
          </FormField>
          <FormField
            className="sm:col-span-2 lg:col-span-1"
            htmlFor="q"
            label="Search"
          >
            <Input
              id="q"
              name="q"
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Name, brand, or code"
              type="search"
              value={searchValue}
            />
          </FormField>
          <div className="tracking-eyebrow text-muted-foreground flex min-h-11 items-center gap-2 text-[11px] uppercase">
            <Search />
            {pending ? "Updating" : "Instant"}
          </div>
          <Button
            disabled={!hasFilters}
            onClick={clearCatalogFilters}
            type="button"
            variant="outline"
          >
            <X />
            Clear
          </Button>
        </div>
      </section>
    </>
  );
};
