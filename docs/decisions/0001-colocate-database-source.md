# 0001: Co-locate The Onesbryne Database Source

- Status: accepted and implemented
- Date: 2026-07-17

## Context

The Onesbryne application lived in `08-onesbryne`, while its dedicated Supabase
schema, migrations, seeds, Storage assets, administrative tooling, and generated
type source lived in `00-databases/projects/onesbryne`. This split required a
manual cross-repository type-copy workflow and separated application changes
from their database contract.

The imported snapshot comes from `00-databases` commit
`d13a76a5efc55e39b525fd032c8218bafce11313`.

## Decision

Onesbryne owns its dedicated database source inside `database/` in the app
repository. The relocation imports:

- readable current-state schema SQL;
- all three immutable timestamped migrations;
- Supabase configuration and the local seed entrypoint;
- deterministic demo catalog data and image assets;
- local-first CLI, lint, type-generation, and SQL-formatting tooling;
- the explicitly remote demo upload/upsert workflow;
- database documentation and agent safety guidance.

The old generated file under `00-databases` is not duplicated. Database types
generate directly into the existing app contract at
`src/types/database.types.ts`.

The transfer is a snapshot import rather than a Git-history rewrite. The source
commit above and immutable SQL migration history preserve provenance.

## Cutover Rule

This repository becomes authoritative only after the imported files match the
source, the database reconstructs locally, generated types match, and normal app
checks pass. After that cutover, `00-databases` must remove its Onesbryne target
and point here instead of retaining a second writable migration history.

Remote linking, pulls, pushes, and demo uploads are not required to prove the
source relocation and remain separate authorization gates.

## Verification At Cutover

- 41 operational files matched the source byte-for-byte before cutover cleanup;
  destination documentation and the generated type location differ
  intentionally.
- The pinned Supabase CLI resolved to `2.98.2`.
- A fresh local start and one standalone local reset reconstructed all three
  migrations and the seed entrypoint successfully.
- SQL formatting checked 13 source/seed files successfully.
- Local database lint reported no schema errors.
- The database test command completed with `Files=0, Tests=0`; authorization
  coverage remains an explicit gap.
- Local type generation wrote and then verified
  `src/types/database.types.ts`. It removed only linked-project PostgREST
  metadata from the prior generated file; the application schema contract is
  unchanged.
- Application formatting, lint, and production build passed after generation.
- After parity, the local Supabase `project_id` was normalized from the old
  multi-target workspace label to `onesbryne`, matching its dedicated Docker
  resource names without changing remote state.

The composite `db:verify` command was also attempted twice. On both attempts,
its reset step applied every migration and the seed entrypoint, then timed out
while the local Storage service restarted. The standalone reset had already
completed successfully and subsequent status, lint, test, and type checks were
healthy. Treat the repeated Storage restart timeout as a local Docker/Supabase
CLI verification caveat, not as authorization coverage or a remote-state check.
