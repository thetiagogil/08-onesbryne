"use client";

import type { ChangeEvent } from "react";

import {
  adminPiecePageSizeOptions,
  adminPieceSortOptions,
  adminPieceStatusOptions,
  normalizeAdminPiecePageSize,
  normalizeAdminPieceSort,
  normalizeAdminPieceStatus,
  type AdminPieceFilters,
  type AdminPiecePageSize,
} from "@/features/admin/lib/admin-piece-filters";
import { FormField } from "@/shared/components/form-field";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Select } from "@/shared/components/ui/select";
import type { Category } from "@/shared/types";

type AdminPiecesFiltersProps = {
  canClear: boolean;
  categories: Category[];
  filters: AdminPieceFilters;
  onClear: () => void;
  onFiltersChange: (filters: AdminPieceFilters) => void;
  onPageSizeChange: (pageSize: AdminPiecePageSize) => void;
  pageSize: AdminPiecePageSize;
};

export function AdminPiecesFilters({
  canClear,
  categories,
  filters,
  onClear,
  onFiltersChange,
  onPageSizeChange,
  pageSize,
}: AdminPiecesFiltersProps) {
  const categoryOptions = [
    { label: "All categories", value: "" },
    ...categories.map((category) => ({
      label: category.label,
      value: category.slug,
    })),
  ];

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    onFiltersChange({
      ...filters,
      query: event.target.value || undefined,
    });
  }

  function handleStatusChange(value: string) {
    onFiltersChange({
      ...filters,
      status: normalizeAdminPieceStatus(value),
    });
  }

  function handleCategoryChange(value: string) {
    onFiltersChange({
      ...filters,
      category: value || undefined,
    });
  }

  function handleSortChange(value: string) {
    onFiltersChange({
      ...filters,
      sort: normalizeAdminPieceSort(value),
    });
  }

  function handlePageSizeChange(value: string) {
    onPageSizeChange(normalizeAdminPiecePageSize(value));
  }

  return (
    <div className="mt-10 grid gap-5 py-5 md:grid-cols-[minmax(0,1fr)_repeat(4,minmax(8rem,11rem))_auto] md:items-end">
      <FormField htmlFor="q" label="Search">
        <Input
          id="q"
          name="q"
          onChange={handleSearchChange}
          placeholder="Name, brand, or code"
          type="search"
          value={filters.query ?? ""}
        />
      </FormField>

      <FormField htmlFor="limit" label="Limit">
        <Select
          id="limit"
          name="limit"
          onValueChange={handlePageSizeChange}
          options={adminPiecePageSizeOptions}
          value={String(pageSize)}
        />
      </FormField>

      <FormField htmlFor="status" label="Status">
        <Select
          id="status"
          name="status"
          onValueChange={handleStatusChange}
          options={adminPieceStatusOptions}
          value={filters.status ?? ""}
        />
      </FormField>

      <FormField htmlFor="category" label="Category">
        <Select
          id="category"
          name="category"
          onValueChange={handleCategoryChange}
          options={categoryOptions}
          value={filters.category ?? ""}
        />
      </FormField>

      <FormField htmlFor="sort" label="Sort">
        <Select
          id="sort"
          name="sort"
          onValueChange={handleSortChange}
          options={adminPieceSortOptions}
          value={filters.sort}
        />
      </FormField>

      <div className="flex items-center gap-4">
        <Button
          disabled={!canClear}
          onClick={onClear}
          type="button"
          variant="outline"
        >
          Clear
        </Button>
      </div>
    </div>
  );
}
