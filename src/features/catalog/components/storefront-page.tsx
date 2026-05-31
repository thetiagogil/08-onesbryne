import Image from "next/image";
import Link from "next/link";

import { ProductCard } from "@/features/catalog/components/product-card";
import { EyebrowLink } from "@/shared/components/ui/eyebrow-link";
import type { Piece } from "@/shared/types";

type StorefrontPageProps = {
  pieces: Piece[];
};

export function StorefrontPage({ pieces }: StorefrontPageProps) {
  return (
    <>
      <section className="relative min-h-[88vh] overflow-hidden">
        <Image
          alt="Onesbryne editorial still life"
          className="absolute inset-0 h-full w-full object-cover"
          fill
          priority
          sizes="100vw"
          src="/hero.jpg"
        />
        <div aria-hidden className="absolute inset-0 bg-background/55" />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-b from-background/30 via-transparent to-background"
        />
        <div className="reveal relative z-10 mx-auto flex min-h-[88vh] max-w-3xl flex-col items-center justify-center px-4 py-32 text-center md:px-6 md:py-40 lg:px-10">
          <h1 className="font-display text-6xl tracking-wordmark uppercase md:text-7xl lg:text-8xl">
            Onesbryne
          </h1>
          <p className="mt-10 max-w-md text-sm leading-relaxed text-foreground/85 md:text-base">
            A private catalog of selected pieces.
          </p>
          <Link
            className="mt-12 inline-block border-b border-foreground pb-1 text-[11px] tracking-eyebrow uppercase transition-colors hover:border-accent hover:text-accent"
            href="/catalog"
          >
            Enter the Catalog
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-400 px-4 py-24 md:px-6 lg:px-10">
        <div className="mb-12 flex items-end justify-between border-b border-hairline pb-4">
          <div>
            <h2 className="font-display text-3xl md:text-5xl">
              The latest pieces
            </h2>
          </div>
          <EyebrowLink className="hidden md:block" href="/catalog">
            View all
          </EyebrowLink>
        </div>

        {pieces.length ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-12 md:gap-x-4 lg:grid-cols-4">
            {pieces.map((piece, index) => (
              <ProductCard
                key={piece.id}
                piece={piece}
                priority={index === 0}
                variant="storefront"
              />
            ))}
          </div>
        ) : (
          <div className="border border-hairline px-6 py-20 text-center">
            <h2 className="font-display text-3xl">No available pieces yet</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              The catalog is connected, but there are no available pieces to
              show.
            </p>
          </div>
        )}
      </section>

      <section className="border-t border-hairline">
        <div className="mx-auto max-w-3xl px-4 py-32 text-center md:px-6 lg:px-10">
          <p className="font-display text-2xl leading-relaxed md:text-3xl">
            Every piece here was chosen, not produced, not stocked. If something
            speaks to you, contact us.
          </p>
        </div>
      </section>
    </>
  );
}
