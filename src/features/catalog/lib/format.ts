export function formatPrice(priceCents: number) {
  return new Intl.NumberFormat("en", {
    currency: "EUR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(priceCents / 100);
}

export function formatCategoryLabel(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function normalizeQueryParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function normalizeCode(value: string) {
  return decodeURIComponent(value).trim().toUpperCase();
}
