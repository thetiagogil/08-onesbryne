# Onesbryne Agent Entry Point

This repository owns both the Onesbryne application and its dedicated Supabase
database. Database work has a high blast radius: establish the source file,
environment, and authorization boundary before changing or running anything.

## Read By Scope

- Read `docs/database.md`, `database/README.md`, and nearby SQL before database
  work.
- Inspect `scripts/database/supabase.mjs` before relying on wrapper behavior.
- Read `docs/decisions/0001-colocate-database-source.md` for migration
  provenance.

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

The database test command is wired but currently has no substantive pgTAP/RLS
suite. Report that limitation instead of treating an empty test run as complete
authorization coverage.
