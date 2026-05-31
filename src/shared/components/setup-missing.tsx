export function SetupMissing() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-display text-4xl">Connect the real catalog</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
        to `.env.local`, then restart the dev server.
      </p>
    </section>
  );
}
