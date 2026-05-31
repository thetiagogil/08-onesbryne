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
            Onesbryne is a private catalog of selected pieces. It is a place to
            discover and acquire unique items that speak to you. Each piece is
            chosen for its quality, story, and connection to the world around
            us.
          </p>
          <p>
            There is no checkout here. If something speaks to you, contact us.
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
