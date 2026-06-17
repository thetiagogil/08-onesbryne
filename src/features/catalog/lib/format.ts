export const formatPrice = (priceCents: number) => {
  return new Intl.NumberFormat("en", {
    currency: "EUR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(priceCents / 100);
};

export const formatCategoryLabel = (slug: string) => {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

export const normalizeQueryParam = (value: string | string[] | undefined) => {
  return Array.isArray(value) ? value[0] : value;
};

export const normalizeCode = (value: string) => {
  return decodeURIComponent(value).trim().toUpperCase();
};
