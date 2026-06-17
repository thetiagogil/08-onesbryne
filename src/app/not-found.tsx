import Link from "next/link";

import { SiteShell } from "@/shared/components/layout/site-shell";
import { Button } from "@/shared/components/ui/button";
import { getCurrentUser } from "@/shared/server/auth";

export default async function NotFound() {
  const currentUser = await getCurrentUser();

  return (
    <SiteShell currentUser={currentUser}>
      <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
        <p className="tracking-eyebrow text-muted-foreground text-[11px] uppercase">
          404
        </p>
        <h1 className="font-display mt-4 text-4xl leading-tight md:text-5xl">
          Page not found
        </h1>
        <p className="text-muted-foreground mt-5 max-w-md text-sm leading-relaxed">
          The page you are looking for does not exist or is no longer available.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/">Go home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/catalog">Browse catalog</Link>
          </Button>
        </div>
      </section>
    </SiteShell>
  );
}
