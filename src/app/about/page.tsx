import { SiteShell } from "@/shared/components/layout/site-shell";
import { PageHeader } from "@/shared/components/page-header";
import { Button } from "@/shared/components/ui/button";
import { SELLER_EMAIL } from "@/shared/constants/app";
import { getCurrentUser } from "@/shared/server/auth";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const currentUser = await getCurrentUser();

  return (
    <SiteShell currentUser={currentUser}>
      <section className="mx-auto max-w-3xl px-6 py-24">
        <PageHeader
          description="Selected fashion resale pieces, edited slowly and handled personally."
          title={
            <>
              A private
              <br />
              catalog.
            </>
          }
        />

        <div className="text-muted-foreground mt-16 space-y-8 text-base leading-relaxed">
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

        <div className="border-hairline mt-16 border-t pt-12">
          <Button asChild variant="outline">
            <a href={`mailto:${SELLER_EMAIL}`}>{SELLER_EMAIL}</a>
          </Button>
        </div>
      </section>
    </SiteShell>
  );
}
