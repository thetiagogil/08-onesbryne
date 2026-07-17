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
    tests/
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

## Environment Boundaries

The app reads browser-safe values from the repository-root `.env.local`.
Database wrappers explicitly load the separate repository-root `.env.database`
for linked or remote tooling. Use the tracked example files as key inventories;
never commit either private file or expose private values through
`NEXT_PUBLIC_*` variables.

The only accepted database variable names are the generic `SUPABASE_*` names
listed in `.env.database.example`.

## Commands And Verification

Routine local work requires Docker but no linked project or remote credentials:

```powershell
npm.cmd run db:start
npm.cmd run db:verify
```

`db:verify` resets the local database, checks SQL formatting, lints the live
schema, runs pgTAP, and checks generated type parity. The pgTAP suite covers
schema and grant invariants, public catalog visibility, admin catalog
mutations, and owner isolation for profiles and favourites.

`db:link`, `db:pull`, `db:push`, `db:types:linked`, and `demo:seed` are separate
remote authorization gates. Confirm the Onesbryne target and current-task
authorization before running any of them.
