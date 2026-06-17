"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import { PIECE_IMAGE_FILE_FIELD } from "@/features/admin/lib/piece-image-form";
import {
  getInitialPieceFormSize,
  getPieceFormSizeOptions,
} from "@/features/admin/lib/piece-form-size-options";
import { pieceStatusOptions } from "@/features/admin/lib/piece-form-options";
import { PieceFormSubmitButton } from "@/features/admin/components/piece-form-submit-button";
import { usePieceImagePreview } from "@/features/admin/hooks/use-piece-image-preview";
import { usePieceForm } from "@/features/admin/hooks/use-piece-form";
import { FormFeedback } from "@/shared/components/form-feedback";
import { FormField } from "@/shared/components/form-field";
import { Input } from "@/shared/components/ui/input";
import { Select } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { ACCEPTED_PIECE_IMAGE_MIME_TYPES } from "@/shared/constants/app";
import {
  isPieceSize,
  pieceConditionOptions,
} from "@/shared/constants/piece-attributes";
import type { Category, CategorySizeOption, Piece } from "@/shared/types";

type PieceFormProps = {
  categories: Category[];
  categorySizeOptions: CategorySizeOption[];
  children?: ReactNode;
  piece?: Piece;
};

export const PieceForm = ({
  categories,
  categorySizeOptions,
  children,
  piece,
}: PieceFormProps) => {
  const form = usePieceForm({ piece });
  const imagePreview = usePieceImagePreview();
  const categoryOptions = categories.map((category) => ({
    label: category.label,
    value: category.slug,
  }));
  const initialCategorySlug = piece?.categorySlug ?? categories[0]?.slug ?? "";
  const [categorySlug, setCategorySlug] = useState(initialCategorySlug);
  const sizeOptions = useMemo(
    () => getPieceFormSizeOptions(categorySizeOptions, categorySlug),
    [categorySizeOptions, categorySlug],
  );
  const [size, setSize] = useState(() =>
    getInitialPieceFormSize({
      categorySizeOptions,
      categorySlug: initialCategorySlug,
      pieceSize: piece?.size,
    }),
  );
  const conditionOptions = [
    { label: "Not specified", value: "" },
    ...pieceConditionOptions,
  ];

  const handleCategoryChange = (nextCategorySlug: string) => {
    const nextSizeOptions = getPieceFormSizeOptions(
      categorySizeOptions,
      nextCategorySlug,
    );

    setCategorySlug(nextCategorySlug);
    setSize((currentSize) =>
      nextSizeOptions.some((option) => option.value === currentSize)
        ? currentSize
        : (nextSizeOptions[0]?.value ?? ""),
    );
  };

  const handleSizeChange = (nextSize: string) => {
    setSize(isPieceSize(nextSize) ? nextSize : "");
  };

  return (
    <form
      action={form.action}
      className="space-y-8"
      onSubmit={form.handleCreateSubmit}
    >
      {form.error ? (
        <FormFeedback tone="error">{form.error}</FormFeedback>
      ) : null}
      {form.state?.ok && form.state.message ? (
        <FormFeedback tone="success">{form.state.message}</FormFeedback>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        <FormField htmlFor="name" label="Name" required>
          <Input
            defaultValue={piece?.name}
            id="name"
            maxLength={120}
            name="name"
            required
          />
        </FormField>
        <FormField htmlFor="brand" label="Brand">
          <Input
            defaultValue={piece?.brand ?? ""}
            id="brand"
            maxLength={120}
            name="brand"
          />
        </FormField>
        <FormField htmlFor="categorySlug" label="Category" required>
          <Select
            id="categorySlug"
            name="categorySlug"
            onValueChange={handleCategoryChange}
            options={categoryOptions}
            required
            value={categorySlug}
          />
        </FormField>
        <FormField htmlFor="size" label="Size" required>
          <Select
            disabled={!sizeOptions.length}
            id="size"
            name="size"
            onValueChange={handleSizeChange}
            options={sizeOptions}
            placeholder="Choose category first"
            required
            value={size}
          />
        </FormField>
        <FormField htmlFor="condition" label="Condition">
          <Select
            defaultValue={piece?.condition ?? ""}
            id="condition"
            name="condition"
            options={conditionOptions}
          />
        </FormField>
        <FormField htmlFor="price" label="Price (EUR)" required>
          <Input
            defaultValue={piece ? String(piece.priceCents / 100) : ""}
            id="price"
            min="0"
            name="price"
            required
            step="0.01"
            type="number"
          />
        </FormField>
        <FormField htmlFor="status" label="Status" required>
          <Select
            defaultValue={piece?.status ?? "draft"}
            id="status"
            name="status"
            options={pieceStatusOptions}
            required
          />
        </FormField>
      </div>

      <FormField htmlFor="description" label="Description" required>
        <Textarea
          defaultValue={piece?.description}
          id="description"
          name="description"
          required
          rows={5}
        />
      </FormField>

      {form.isCreate ? (
        <FormField htmlFor={PIECE_IMAGE_FILE_FIELD} label="Image" required>
          <Input
            accept={ACCEPTED_PIECE_IMAGE_MIME_TYPES.join(",")}
            id={PIECE_IMAGE_FILE_FIELD}
            name={PIECE_IMAGE_FILE_FIELD}
            onChange={imagePreview.handleImageChange}
            required
            type="file"
          />
          {imagePreview.preview ? (
            <div className="border-hairline grid gap-4 border p-3 sm:grid-cols-[8rem_1fr] sm:items-center">
              <div
                aria-label={`Preview of ${imagePreview.preview.name}`}
                className="aspect-[4/5] bg-cover bg-center"
                role="img"
                style={{
                  backgroundImage: `url(${imagePreview.preview.url})`,
                }}
              />
              <div>
                <p className="text-foreground text-sm">
                  {imagePreview.preview.name}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {imagePreview.preview.sizeLabel} before app compression.
                </p>
              </div>
            </div>
          ) : null}
          <p className="text-muted-foreground text-xs">
            Add the first JPEG or WebP image. It will be resized and compressed
            before the piece is created.
          </p>
        </FormField>
      ) : null}

      {children}

      <PieceFormSubmitButton
        label={piece ? "Save piece" : "Create piece"}
        pending={form.isPending}
        pendingLabel={form.pendingLabel}
      />
    </form>
  );
};
