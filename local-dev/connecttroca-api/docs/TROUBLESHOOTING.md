# Troubleshooting

## Purpose

This document covers the most common local problems for this Strapi backend and how to isolate them.

## Problem: `docker compose up --build` fails before containers start

Common causes:

- Docker Desktop is not running
- the Docker engine is unhealthy
- the command is being run from the wrong folder

Checks:

1. confirm Docker Desktop is open
2. confirm you are in the backend project folder
3. run `docker version`
4. run `docker compose config`

If `docker version` fails before showing server information, the problem is Docker Desktop, not this project.

## Problem: Docker returns `Internal Server Error` for API route and version

This is a Docker engine problem, not a Strapi problem.

Common causes:

- Docker Desktop backend crashed
- WSL Docker VM is unhealthy
- Docker internal storage is corrupted

Safe recovery sequence:

```powershell
Get-Process 'Docker Desktop','com.docker.backend','com.docker.build','com.docker.dev-envs' -ErrorAction SilentlyContinue | Stop-Process -Force
wsl --shutdown
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
```

If the error keeps returning after restart, use Docker Desktop troubleshooting tools such as `Clean / Purge data` or `Reset to factory defaults`.
Those options are destructive to Docker data.

## Problem: the admin panel does not open

Expected URL:

```text
http://localhost:1337/admin
```

Checks:

1. run `docker compose ps`
2. run `docker compose logs -f strapi`
3. confirm the `strapi` service is still running
4. confirm port `1337` is not blocked by another process

## Problem: the health endpoint does not respond

Expected URL:

```text
http://localhost:1337/api/health
```

Checks:

1. inspect Strapi logs
2. confirm `src/api/health/routes/health.ts` exists
3. confirm `src/api/health/controllers/health.ts` exists
4. confirm the `strapi` container is healthy and running

## Problem: Strapi cannot connect to PostgreSQL

Checks:

1. confirm `DATABASE_HOST=postgres`
2. confirm `DATABASE_PORT=5432`
3. confirm `DATABASE_NAME`, `DATABASE_USERNAME`, and `DATABASE_PASSWORD` match the compose values
4. inspect PostgreSQL logs with `docker compose logs -f postgres`

If the database state is disposable, reset the project volumes:

```powershell
docker compose down -v
docker compose up --build
```

## Problem: changes in `src` or `config` do not seem to apply

Checks:

1. confirm you are editing files inside the backend project folder
2. confirm the changes are under mounted development paths such as `src`, `config`, or `public`
3. inspect Strapi logs
4. if the change was a dependency change, rebuild the image

Dependency changes require:

```powershell
docker compose up --build
```

## Problem: `npm run build` or `npm run develop` fails on the host machine

Checks:

1. confirm Node `20+` is active
2. confirm dependencies were installed with `npm ci`
3. run `npm run typecheck`

The project is aligned to Strapi 5 and should not be treated as a Node 18 workspace.

## Problem: the frontend gets CORS errors

Checks:

1. inspect `.env`
2. confirm the frontend origin is present in `CORS_ORIGIN`
3. restart the backend after changing environment variables

## Problem: the environment is too broken to trust

Project-level reset:

```powershell
docker compose down -v
docker compose up --build
```

Docker-engine-level reset:

- restart Docker Desktop
- shut down WSL
- only if necessary, use Docker Desktop cleanup/reset tools

## Practical debugging rule

Change one layer at a time.

- if the issue appears before `docker version` succeeds, debug Docker
- if Docker is healthy but Strapi fails, inspect project config and logs
- if Strapi is healthy but the frontend fails, inspect permissions, routes, and CORS
