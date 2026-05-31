import { formatPieceSize } from "@/shared/constants/piece-attributes";
import type { CategorySizeOption, PieceSize } from "@/shared/types";

type SelectOption = {
  label: string;
  value: PieceSize;
};

type InitialPieceFormSizeInput = {
  categorySizeOptions: CategorySizeOption[];
  categorySlug: string;
  pieceSize?: PieceSize;
};

export function getPieceFormSizeOptions(
  categorySizeOptions: CategorySizeOption[],
  categorySlug: string,
): SelectOption[] {
  return categorySizeOptions
    .filter((option) => option.categorySlug === categorySlug)
    .map((option) => ({
      label: formatPieceSize(option.size),
      value: option.size,
    }));
}

export function getInitialPieceFormSize({
  categorySizeOptions,
  categorySlug,
  pieceSize,
}: InitialPieceFormSizeInput): PieceSize | "" {
  const options = getPieceFormSizeOptions(categorySizeOptions, categorySlug);

  if (pieceSize && options.some((option) => option.value === pieceSize)) {
    return pieceSize;
  }

  return options[0]?.value ?? "";
}
