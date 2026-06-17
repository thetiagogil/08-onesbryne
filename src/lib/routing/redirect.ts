export const safeRedirectPath = (
  value: string | null | undefined,
  fallback = "/",
) => {
  const trimmed = value?.trim();

  if (
    !trimmed ||
    !trimmed.startsWith("/") ||
    trimmed.startsWith("//") ||
    trimmed.includes("\\")
  ) {
    return fallback;
  }

  try {
    const parsed = new URL(trimmed, "https://onesbryne.local");
    if (parsed.origin !== "https://onesbryne.local") return fallback;

    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
};
