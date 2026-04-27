# Future Development Areas

## Purpose of this document

This document explains where future backend development should happen and what kinds of work belong in each area.
It is intended to prevent junior engineers from editing the wrong layer of the application.

## Main rule

Most project-specific backend work should happen in `src/api`.
That is the default development area for business features.

Before creating those modules, read:

```text
docs/ENTITY_RELATIONSHIP_BLUEPRINT.md
```

## Area 1. `src/api`

This is the primary feature-development area.
Use it for backend modules that represent real application features.

Expected near-term modules for this project:

- `src/api/profile`
- `src/api/group`
- `src/api/group-membership`
- `src/api/resource`
- `src/api/forum-category`
- `src/api/forum-topic`
- `src/api/forum-post`
- `src/api/group-message`

Work that belongs here:

- routes
- controllers
- services
- policies
- feature-specific validation
- custom business logic

If a change is about a real user-facing feature, it will usually belong here.

Important relation rule:

- if the relationship has business fields such as `role`, `status`, or `joinedAt`, model it as its own collection type

## Area 2. Strapi admin panel

Use the admin panel for model and permission management tasks.

Work that belongs here:

- creating content types
- creating fields
- defining relations
- configuring roles
- adjusting permissions
- managing sample content

If the task is mainly about content modeling or permissions, start in the admin panel before writing custom code.

## Area 3. `config`

Use `config` only for cross-cutting concerns.

Work that belongs here:

- CORS changes
- API defaults
- server host and port changes
- public URL changes
- database connection changes
- security-related middleware changes

Do not place feature logic in `config`.

## Area 4. `docs`

Documentation must evolve with the codebase.
A junior engineer should update docs when a change affects how another engineer runs or understands the backend.

Work that belongs here:

- new setup steps
- new commands
- new required environment variables
- new major backend modules
- new troubleshooting knowledge

## Area 5. `.env.example`

Use this file when the team introduces a new environment variable that everyone should know about.

Examples:

- a new external service URL
- a new public backend setting
- a new authentication or integration key name

Do not put personal machine values or secrets directly into `.env.example` unless the team explicitly agreed on safe placeholder values.

## Recommended implementation order for this project

A sensible initial order is:

1. `profile`
2. `group`
3. `group-membership`
4. `resource`
5. `forum-category`
6. `forum-topic`
7. `forum-post`
8. `group-message`

Reasoning:

- profile and group data support multiple screens
- resources and forum entities are relatively straightforward content-driven features
- group messages depend on stable user and group relations first

## What should not be the default development area

Do not start normal project feature work in:

- the root of the Strapi monorepo
- Docker configuration files unless the problem is environment-related
- database configuration unless the problem is connection-related

Those files matter, but they are not the default place for business features.

## Practical rule of thumb

If the work is about what the app does for users, start in `src/api`.
If the work is about how the backend starts or connects, inspect `config`, `.env`, `Dockerfile`, or `docker-compose.yml`.
If the work is about content modeling or roles, start in the Strapi admin panel.
