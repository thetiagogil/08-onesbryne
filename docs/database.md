# Onesbryne Database Guide

The dedicated Onesbryne Supabase database is co-located with the application.
Human-readable current-state SQL, immutable migrations, deterministic demo
sources, Supabase configuration, and database tooling live in this repository.

## Ownership

- `database/schema` is the readable current database contract.
- `database/supabase/migrations` is the append-only deployment history.
- `database/seeds/demo` owns the deterministic demo catalog and image assets.
- `src/types/database.types.ts` is the generated app-facing contract.
- Application code accesses Supabase through `src/lib/supabase`; it does not own
  migrations.

The source was relocated from `../00-databases/projects/onesbryne` at commit
`d13a76a5efc55e39b525fd032c8218bafce11313`. See
[`decisions/0001-colocate-database-source.md`](decisions/0001-colocate-database-source.md).

## Local Workflow

Install dependencies and discover the pinned CLI:

```powershell
npm.cmd install
npm.cmd run db:cli:version
npm.cmd run db:help
```

Start and reconstruct the local database:

```powershell
npm.cmd run db:start
npm.cmd run db:reset
```

The local Supabase `project_id` is `onesbryne`, so Docker resources use names
such as `supabase_db_onesbryne`. This identifier is local configuration; it does
not link or rename the remote project.

For a deployable change, create a new timestamped migration, update matching
current-state SQL, then verify:

```powershell
npm.cmd run db:new -- describe_change
npm.cmd run db:verify
```

Applied migrations must not be renamed, reformatted, reordered, or rewritten.

## Generated Types

Generate from the running local database:

```powershell
npm.cmd run db:types
```

The command writes directly to `src/types/database.types.ts`. The check command
fails when that file differs from a fresh local generation:

```powershell
npm.cmd run db:types:check
```

Linked generation is a separate remote read and requires explicit current-task
authorization.

## Remote Operations

`database/env.example` documents private database-tooling variable names. Copy
it to ignored root `.env.database` only when an explicitly authorized remote
workflow requires credentials.

These commands operate on linked state and are never part of routine local
verification:

```powershell
npm.cmd run db:link
npm.cmd run db:pull
npm.cmd run db:push:dry
npm.cmd run db:push
npm.cmd run db:types:linked
npm.cmd run demo:seed
```

A dry run is evidence only; it does not authorize a push. Never read or print
environment values during verification.

## Verification Reality

`db:test` is wired to Supabase's local database test command, but the imported
target does not yet contain a substantive pgTAP/RLS suite. A reset, lint pass,
and generated-type check prove reconstruction and contract parity, not complete
authorization coverage.
