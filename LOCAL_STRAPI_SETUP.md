# Local Strapi Backend Setup for ConnectTroca

## Purpose

This document explains the recommended local setup for the ConnectTroca backend.
It is written for junior engineers and aligns the project with better Strapi 5 development practices.

## Important context

The folder `backend_conectra` is the upstream Strapi monorepo.
That monorepo is not the daily project backend.

The actual project backend workspace is:

```text
local-dev/connecttroca-api
```

If you use the published standalone repository, the same backend project exists at repository root.

## How to enter the project

### Monorepo layout

```powershell
cd "C:\Users\vasil\Documents\Aulas\projeto integrado 2\backend_conectra\local-dev\connecttroca-api"
```

### Published standalone repository

```powershell
git clone https://github.com/umbranian0/connectroca-back-end-system.git
cd connectroca-back-end-system
```

## Runtime model

The standard local runtime is Docker Compose.

The stack includes:

- PostgreSQL
- Strapi

Good-practice decisions in the current setup:

- Node dependencies are installed in the Docker image with `npm ci`
- the container mounts only development folders instead of replacing the whole app root
- Strapi has a container healthcheck based on `/api/health`
- admin session settings are explicitly configured
- API pagination defaults are centralized in config

## Prerequisites

- Docker Desktop
- PowerShell
- Git if cloning the standalone repository
- Node `20+` only if you plan to run host-machine `npm` commands

## First-time setup

### Step 1. Go to the backend project folder

Use one of the paths shown above.

### Step 2. Create the local environment file

```powershell
npm run setup:local
```

### Step 3. Start the backend stack

```powershell
docker compose up --build
```

What this does:

- builds the Strapi development image
- installs dependencies inside the image with `npm ci`
- starts PostgreSQL
- starts Strapi
- mounts `src`, `config`, `public`, and generated `types` for local development

### Step 4. Wait until Strapi is ready

The first startup must finish the Strapi boot sequence.
Wait until logs show `Strapi started successfully`.

### Step 5. Open the admin panel

```text
http://localhost:1337/admin
```

Create the first administrator account when prompted.

### Step 6. Validate the public health endpoint

```text
http://localhost:1337/api/health
```

Expected result:

- a JSON response
- `status: ok`

## Day-to-day commands

### Start the local stack

```powershell
docker compose up --build
```

Use this after:

- dependency changes
- Dockerfile changes
- environment resets

### Stop the stack

```powershell
docker compose down
```

### Reset local project state

```powershell
docker compose down -v
```

This removes named volumes, including PostgreSQL data.

### Inspect status

```powershell
docker compose ps
docker compose logs -f strapi
docker compose logs -f postgres
```

### npm shortcuts

```powershell
npm run docker:up
npm run docker:down
npm run docker:logs
npm run docker:ps
npm run docker:reset
```

## Host-machine commands

Use host-machine `npm` commands only when you need direct debugging outside Docker.

The project expects:

- Node `20.20.2` via `.nvmrc`
- npm `10+`

Install dependencies from the lockfile:

```powershell
npm ci
```

Then use:

```powershell
npm run check
npm run develop
```

If you need the individual host-machine commands:

```powershell
npm run typecheck
npm run build
```

## Strapi development good practices used in this project

### 1. Prefer content types before custom code

For standard CRUD, start by creating the content type in Strapi.
Do not write custom controllers before checking whether generated CRUD already solves the need.

### 2. Keep controllers thin

Controllers should mainly:

- receive the request
- call a service if needed
- return a response

### 3. Put business logic in services

If behavior is reusable or domain-specific, it belongs in a service.

### 4. Commit generated schemas

Content-type changes generate source files under:

```text
src/api/<feature>/content-types/<feature>/schema.json
```

Those files should be committed.

### 5. Review permissions early

Use the `users-permissions` plugin intentionally.
Do not leave new routes public by accident.

### 6. Use reproducible installs

Use:

- `npm ci` on the host machine
- `npm run setup:local` for first local initialization
- `docker compose up --build` for Docker rebuilds

## Where future development should happen

### Primary feature area

```text
src/api
```

Likely first modules:

- `profile`
- `group`
- `group-membership`
- `resources`
- `forum-category`
- `forum-topic`
- `forum-post`
- `group-message`

### Content modeling and permissions

Use the Strapi admin panel for:

- content types
- fields
- relations
- permissions
- sample content

### Cross-cutting config

Use `config/` only for:

- CORS
- database settings
- server settings
- pagination defaults
- admin settings

### Documentation

Update `docs/` when a change affects:

- setup steps
- commands
- environment variables
- feature structure

## Documentation map

Read these files in order:

1. `README.md`
2. `LOCAL_STRAPI_SETUP.md`
3. `docs/COMMAND_REFERENCE.md`
4. `docs/PROJECT_STRUCTURE.md`
5. `docs/STRAPI_DEVELOPMENT_STANDARDS.md`
6. `docs/ENTITY_RELATIONSHIP_BLUEPRINT.md`
7. `docs/ERD_API_EXAMPLE.md`
8. `docs/API_DEVELOPMENT_WORKFLOW.md`
9. `docs/FUTURE_DEVELOPMENT_AREAS.md`
10. `docs/TROUBLESHOOTING.md`

## Troubleshooting note

If `docker compose` fails with Docker API internal server errors before the project even starts, treat it as a Docker Desktop problem first.
The recent known recovery sequence is:

```powershell
Get-Process 'Docker Desktop','com.docker.backend','com.docker.build','com.docker.dev-envs' -ErrorAction SilentlyContinue | Stop-Process -Force
wsl --shutdown
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
```

If Docker itself remains unhealthy after restart, use Docker Desktop troubleshooting tools.
