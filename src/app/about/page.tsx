import { SiteShell } from "@/shared/components/layout/site-shell";
import { SELLER_EMAIL } from "@/shared/constants/app";
import { getCurrentUser } from "@/shared/server/auth";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const currentUser = await getCurrentUser();

  return (
    <SiteShell currentUser={currentUser}>
      <section className="mx-auto max-w-3xl px-6 py-24">
        <h1 className="font-display text-5xl leading-[0.95] md:text-7xl">
          A private
          <br />
          catalog.
        </h1>

        <div className="mt-16 space-y-8 text-base leading-relaxed text-muted-foreground">
          <p>
            ONESBRYNE is a curated resale catalog of selected clothing pieces:
            coats kept for too long, dresses worn once, knitwear loved and
            outgrown. Each item is chosen, considered, and listed only when it
            is ready to find a new home.
          </p>
          <p>
            There is no checkout here. If a piece speaks to you, write an email.
          </p>
        </div>

        <div className="mt-16 border-t border-hairline pt-12">
          <a
            className="inline-block font-display text-2xl link-underline"
            href={`mailto:${SELLER_EMAIL}`}
          >
            {SELLER_EMAIL}
          </a>
        </div>
      </section>
    </SiteShell>
  );
}
