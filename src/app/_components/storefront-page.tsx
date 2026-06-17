import Image from "next/image";
import Link from "next/link";

import { ProductCard } from "@/features/catalog/components/product-card";
import { EmptyState } from "@/shared/components/empty-state";
import { SectionHeader } from "@/shared/components/section-header";
import { Button } from "@/shared/components/ui/button";
import { EyebrowLink } from "@/shared/components/ui/eyebrow-link";
import type { Piece } from "@/shared/types";

type StorefrontPageProps = {
  pieces: Piece[];
};

export const StorefrontPage = ({ pieces }: StorefrontPageProps) => {
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
        <div aria-hidden className="bg-background/55 absolute inset-0" />
        <div
          aria-hidden
          className="from-background/30 to-background absolute inset-0 bg-linear-to-b via-transparent"
        />
        <div className="reveal relative z-10 mx-auto flex min-h-[88vh] max-w-3xl flex-col items-center justify-center px-4 py-32 text-center md:px-6 md:py-40 lg:px-10">
          <h1 className="font-display tracking-wordmark text-6xl uppercase md:text-7xl lg:text-8xl">
            Onesbryne
          </h1>
          <p className="text-foreground/85 mt-10 max-w-md text-sm leading-relaxed md:text-base">
            A private catalog of selected pieces.
          </p>
          <Button asChild className="mt-12" variant="outline">
            <Link href="/catalog">Enter the catalog</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto w-full max-w-400 px-4 py-24 md:px-6 lg:px-10">
        <SectionHeader
          action={
            <EyebrowLink className="hidden md:block" href="/catalog">
              View all
            </EyebrowLink>
          }
          title="The latest pieces"
        />

        {pieces.length ? (
          <div className="mt-12 grid grid-cols-2 gap-x-3 gap-y-12 md:gap-x-4 lg:grid-cols-4">
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
          <EmptyState
            className="mt-12"
            description="The catalog is connected, but there are no available pieces to show."
            title="No available pieces yet"
          />
        )}
      </section>

      <section className="border-hairline border-t">
        <div className="mx-auto max-w-3xl px-4 py-32 text-center md:px-6 lg:px-10">
          <p className="font-display text-2xl leading-relaxed md:text-3xl">
            Every piece here was chosen, not produced, not stocked. If something
            speaks to you, contact us.
          </p>
        </div>
      </section>
    </>
  );
};
