import type { PieceCondition, PieceSize, PieceStatus } from "@/shared/types";

export const pieceSizeOptions: { label: string; value: PieceSize }[] = [
  { label: "XXS", value: "xxs" },
  { label: "XS", value: "xs" },
  { label: "S", value: "s" },
  { label: "M", value: "m" },
  { label: "L", value: "l" },
  { label: "XL", value: "xl" },
  { label: "XXL", value: "xxl" },
  { label: "One size", value: "one_size" },
  { label: "EU 35", value: "eu_35" },
  { label: "EU 36", value: "eu_36" },
  { label: "EU 37", value: "eu_37" },
  { label: "EU 38", value: "eu_38" },
  { label: "EU 39", value: "eu_39" },
  { label: "EU 40", value: "eu_40" },
  { label: "EU 41", value: "eu_41" },
  { label: "EU 42", value: "eu_42" },
  { label: "W24", value: "w24" },
  { label: "W25", value: "w25" },
  { label: "W26", value: "w26" },
  { label: "W27", value: "w27" },
  { label: "W28", value: "w28" },
  { label: "W29", value: "w29" },
  { label: "W30", value: "w30" },
  { label: "W31", value: "w31" },
  { label: "W32", value: "w32" },
  { label: "W33", value: "w33" },
  { label: "W34", value: "w34" },
];

export const pieceConditionOptions: {
  label: string;
  value: PieceCondition;
}[] = [
  { label: "New with tags", value: "new_with_tags" },
  { label: "Excellent", value: "excellent" },
  { label: "Very good", value: "very_good" },
  { label: "Good", value: "good" },
  { label: "Light wear", value: "light_wear" },
  { label: "Visible wear", value: "visible_wear" },
];

export const pieceStatusLabels: Record<PieceStatus, string> = {
  archived: "Archived",
  available: "Available",
  draft: "Draft",
  reserved: "Reserved",
  sold: "Sold",
};

export function formatPieceSize(value: PieceSize) {
  return (
    pieceSizeOptions.find((option) => option.value === value)?.label ?? value
  );
}

export function formatPieceCondition(value: PieceCondition) {
  return (
    pieceConditionOptions.find((option) => option.value === value)?.label ??
    value
  );
}

export function formatPieceStatus(value: PieceStatus) {
  return pieceStatusLabels[value];
}

export function sortPieceSizes(values: PieceSize[]) {
  const order = new Map(
    pieceSizeOptions.map((option, index) => [option.value, index]),
  );

  return [...values].sort(
    (left, right) =>
      (order.get(left) ?? Number.MAX_SAFE_INTEGER) -
      (order.get(right) ?? Number.MAX_SAFE_INTEGER),
  );
}

export function isPieceSize(value: string): value is PieceSize {
  return pieceSizeOptions.some((option) => option.value === value);
}

export function isPieceCondition(value: string): value is PieceCondition {
  return pieceConditionOptions.some((option) => option.value === value);
}
