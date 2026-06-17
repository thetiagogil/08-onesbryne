import Link from "next/link";

import { buildCatalogHref } from "@/features/catalog/lib/catalog-routing";
import type { CatalogSort } from "@/features/catalog/server/queries";

type CategoryFilterLinkProps = {
  active: boolean;
  label: string;
  query?: string;
  slug?: string;
  sort: CatalogSort;
};

export const CategoryFilterLink = ({
  active,
  label,
  query,
  slug,
  sort,
}: CategoryFilterLinkProps) => {
  const href = buildCatalogHref({
    category: slug,
    query,
    sort,
  });

  return (
    <Link
      className={
        active
          ? "border-foreground bg-foreground tracking-eyebrow text-background border px-4 py-2 text-[11px] uppercase"
          : "border-hairline tracking-eyebrow text-muted-foreground hover:border-accent hover:text-foreground border px-4 py-2 text-[11px] uppercase transition-colors"
      }
      href={href}
    >
      {label}
    </Link>
  );
};
