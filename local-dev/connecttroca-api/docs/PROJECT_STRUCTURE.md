# Project Structure

## Purpose

This document explains where code should live in this Strapi project.
The goal is to help junior engineers choose the correct layer before they start editing files.

## Root files

### `package.json`

Defines:

- scripts
- runtime dependencies
- development dependencies
- supported Node and npm versions

### `package-lock.json`

Locks exact package versions.
Keep this file in sync with `package.json`.

### `.nvmrc`

Defines the expected host-machine Node version for local `npm` commands.

### `.env.example`

Template for the shared runtime configuration.
Copy this to `.env` for local work.

### `.env`

Machine-local runtime configuration.
Do not commit this file.

### `docker-compose.yml`

Defines the local development stack:

- PostgreSQL
- Strapi
- container health checks
- mounted development folders

### `Dockerfile`

Defines the Strapi development image.
Dependencies are installed with `npm ci` during image build.

### `scripts/`

Small project helper scripts.
The main entrypoint is `scripts/setup-local.mjs`.

## Configuration layer

Everything in `config/` affects the whole backend application.

### `config/admin.ts`

Admin configuration:

- admin path
- admin JWT secret
- session lifespans
- audit log settings
- token salts

### `config/api.ts`

Global REST API defaults such as:

- default pagination limit
- maximum pagination limit
- whether total counts are returned

### `config/database.ts`

Database connection configuration for PostgreSQL.

### `config/middlewares.ts`

Application middleware configuration, including:

- security headers
- CORS
- body parsing
- sessions
- public file serving

### `config/server.ts`

Server host, port, public URL, and app keys.

## Source layer

### `src/index.ts`

Application-level register and bootstrap hooks.
Use this file for app-wide initialization that does not belong to a single feature.

### `src/api`

Primary location for project features.
This is the default place for backend business modules.

Typical feature layout:

```text
src/api/<feature>/
  content-types/<feature>/schema.json
  controllers/
  routes/
  services/
  policies/
```

### `src/api/<feature>/content-types/<feature>/schema.json`

Generated Strapi content-type schema.
If you create or edit a content type through Strapi, this file should be committed.

### `src/api/README.md`

Quick orientation file for the feature area.
Use it to confirm the next expected modules and the relation-aware development rules.

### `src/api/<feature>/controllers`

HTTP request handlers.
Keep these thin.

### `src/api/<feature>/services`

Business logic and reusable orchestration.
This is the preferred home for custom backend behavior.

### `src/api/<feature>/routes`

Custom route definitions when generated CRUD is not enough.

### `src/api/<feature>/policies`

Feature-level access rules and request constraints.

### `src/api/health`

Minimal example feature used to validate that the backend is alive.
This is intentionally simpler than a real business module.

## Generated types

### `types/generated`

Generated Strapi TypeScript definitions.
Do not place business logic here.
These files support editor tooling and type safety.

## Public assets

### `public/uploads`

Persistent uploaded files.
In Docker, uploads are stored through a named volume.

## Safe editing zones

A junior engineer will usually work in:

- `src/api`
- the Strapi admin panel
- `.env`
- selected files in `config`
- `docs`

## Files that affect the whole team

Be careful with:

- `docker-compose.yml`
- `Dockerfile`
- `config/database.ts`
- `config/middlewares.ts`
- `config/server.ts`
- `config/admin.ts`

These files affect startup, security, database behavior, and local integration.

## Practical rule

If you are building a user-facing feature, start in `src/api`.
If you are modeling data, start in the Strapi admin panel.
If you are fixing environment or integration problems, inspect Docker, `.env`, and `config`.
