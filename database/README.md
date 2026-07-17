# Onesbryne Database

This directory is the source of truth for the dedicated Onesbryne Supabase
project.

## Layout

```text
database/
  schema/
    private/
    public/
    storage/
  seeds/
    demo/
  supabase/
    migrations/
    config.toml
    seed.sql
```

Readable current-state SQL lives under `schema/`. Timestamped files under
`supabase/migrations/` are the immutable deployable migration history. Keep both
representations aligned whenever the database shape changes.

Reference categories are created by the foundation migration. Deterministic
demo catalog data and WebP image assets live under `seeds/demo/`. The
`npm run demo:seed` command uploads Storage objects and writes catalog rows to a
linked remote target; it is not part of local onboarding or verification.

Generated application types live only at
`../src/types/database.types.ts`. Run `npm run db:types` after local schema
changes and inspect the generated diff.

See [`../docs/database.md`](../docs/database.md) for commands, safety rules, and
known verification gaps.
