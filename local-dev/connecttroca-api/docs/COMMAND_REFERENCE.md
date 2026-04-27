# Command Reference

## Purpose

This document explains the commands used most often in the ConnectTroca Strapi backend and when to use them.

## Enter the project first

Monorepo layout:

```powershell
cd "C:\Users\vasil\Documents\Aulas\projeto integrado 2\backend_conectra\local-dev\connecttroca-api"
```

Standalone published repository:

```powershell
cd connectroca-back-end-system
```

## Environment setup

### `npm run setup:local`

Creates `.env` from `.env.example` when it does not exist and prints the correct next steps.

Use this when:

- setting up the project for the first time
- recreating a deleted `.env`
- refreshing local config after team-level `.env.example` changes

## Docker workflow

### `docker compose up --build`

Standard local development command.

Use this when:

- starting the project
- rebuilding after dependency changes
- rebuilding after Dockerfile changes

### `docker compose down`

Stops containers and keeps volumes.

### `docker compose down -v`

Stops containers and removes named volumes.

Use this when:

- local database state can be discarded
- the environment is inconsistent
- Docker state needs a clean rebuild at the project level

### `docker compose ps`

Shows whether PostgreSQL and Strapi are running and healthy.

### `docker compose logs -f strapi`

Streams Strapi logs continuously.

Use this when:

- waiting for first startup
- debugging route or permission issues
- checking whether Strapi has finished rebuilding

### `docker compose logs -f postgres`

Streams PostgreSQL logs continuously.

Use this when:

- database startup fails
- Strapi cannot connect to the database

## Host-machine npm workflow

Before host-machine commands, make sure Node `20+` is active and install dependencies from the lockfile:

```powershell
npm ci
```

### `npm run develop`

Starts Strapi in development mode on the host machine.

### `npm run build`

Builds the Strapi admin panel.

### `npm run check`

Runs the standard host-machine validation sequence:

- `npm run typecheck`
- `npm run build`

### `npm run start`

Starts Strapi in non-development mode.

### `npm run console`

Opens the Strapi console.

### `npm run typecheck`

Runs TypeScript type checking with no emitted files.

### `npm run docker:check`

Validates the Docker Compose file without starting the stack.

### `npm run strapi -- help`

Exposes Strapi CLI help.

## npm Docker shortcuts

### `npm run docker:up`

Shortcut for:

```powershell
docker compose up --build
```

### `npm run docker:down`

Shortcut for:

```powershell
docker compose down
```

### `npm run docker:logs`

Shortcut for:

```powershell
docker compose logs -f strapi
```

### `npm run docker:ps`

Shortcut for:

```powershell
docker compose ps
```

### `npm run docker:reset`

Shortcut for:

```powershell
docker compose down -v
```

## Recommended first-run sequence

```powershell
npm run setup:local
docker compose up --build
```

Then validate:

```text
http://localhost:1337/admin
http://localhost:1337/api/health
```

## Recommended daily sequence

Start:

```powershell
docker compose up --build
```

Inspect status:

```powershell
docker compose ps
docker compose logs -f strapi
```

Stop:

```powershell
docker compose down
```

## Important command rule

If `package.json` or `package-lock.json` changes, rebuild the Docker image with:

```powershell
docker compose up --build
```

The container image installs dependencies during build, which is the intended reproducible workflow.

## Entity-modeling rule

Before creating the first real business module, read:

```text
docs/ENTITY_RELATIONSHIP_BLUEPRINT.md
```

If you need a concrete endpoint and payload example for that model, then read:

```text
docs/ERD_API_EXAMPLE.md
```
