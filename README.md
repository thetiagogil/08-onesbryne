# Onesbryne

Onesbryne is a Next.js application with its dedicated Supabase database source
co-located in this repository.

## Application Workflow

Install dependencies and start the development server:

```powershell
npm.cmd install
npm.cmd run dev
```

Run the application checks:

```powershell
npm.cmd run format:check
npm.cmd run lint
npm.cmd run build
```

## Database Workflow

The authoritative schema, migrations, seed sources, Supabase configuration, and
database-specific assets live under `database/`. Generated application types
live at `src/types/database.types.ts`; there is no second generated copy under
`database/`.

Start with [`docs/database.md`](docs/database.md) for commands and safety rules,
[`database/README.md`](database/README.md) for the source layout, and
[`AGENTS.md`](AGENTS.md) before making database changes.

Local database verification requires Docker Desktop or another compatible
Docker runtime:

```powershell
npm.cmd run db:start
npm.cmd run db:verify
```

Remote linking, pulls, pushes, linked type generation, and demo uploads are
separate authorization gates and are not part of routine local onboarding.
