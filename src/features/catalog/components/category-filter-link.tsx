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

export function CategoryFilterLink({
  active,
  label,
  query,
  slug,
  sort,
}: CategoryFilterLinkProps) {
  const href = buildCatalogHref({
    category: slug,
    query,
    sort,
  });

  return (
    <Link
      className={
        active
          ? "border border-foreground bg-foreground px-4 py-2 text-[11px] tracking-eyebrow text-background uppercase"
          : "border border-hairline px-4 py-2 text-[11px] tracking-eyebrow text-muted-foreground uppercase transition-colors hover:border-accent hover:text-foreground"
      }
      href={href}
    >
      {label}
    </Link>
  );
}
