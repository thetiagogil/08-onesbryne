# Onesbryne Agent Entry Point

This repository owns both the Onesbryne application and its dedicated Supabase
database. Database work has a high blast radius: establish the source file,
environment, and authorization boundary before changing or running anything.

## Read By Scope

- Read `database/README.md` and nearby SQL before database work.
- Inspect `scripts/database/supabase.mjs` before relying on wrapper behavior.
- Inspect the root `README.md` and `package.json` scripts for onboarding and
  verification commands.

## Database Rules

- `database/` is the source of truth for schema, migrations, seeds, Supabase
  configuration, and database-specific assets.
- Work local-first. Linking, pulls, pushes, linked type generation, demo uploads,
  destructive operations, and production changes require explicit current-task
  authorization and a confirmed target.
- Add new immutable timestamped migrations for deployable changes. Do not
  rewrite migrations that may already have run.
- Keep readable current-state SQL under `database/schema` aligned with
  migrations.
- Generate the app contract directly into
  `src/types/database.types.ts`; do not keep a second generated copy under
  `database/`.
- Keep browser-safe application values in `.env.local` and private database
  tooling values in `.env.database`. Start from the corresponding tracked
  example, use only its generic `SUPABASE_*` names, and do not move private
  credentials into `NEXT_PUBLIC_*` variables.
- Never read, print, copy, or summarize credentials or environment values.
- Preserve unrelated dirty worktree changes.

## Verification

Use the smallest relevant subset. The full local database sequence is:

```powershell
npm.cmd run db:verify
npm.cmd run format:check
npm.cmd run lint
npm.cmd run build
```

The pgTAP suite covers schema and grant invariants, public catalog visibility,
admin catalog mutations, and owner isolation for profiles and favourites.
