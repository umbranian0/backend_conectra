# Strapi Development Standards

## Purpose

This document defines the backend development standards for this Strapi project.
It is intended to keep junior engineers on a consistent path and reduce accidental anti-patterns.

## Core rules

- Prefer generated Strapi CRUD before writing custom logic.
- Keep controllers thin.
- Move business rules into services.
- Keep permissions explicit.
- Commit schema files after every content-type change.
- Treat Docker as the default local runtime.

## Content modeling

Start with the content model, not the controller.

When a new feature is requested:

1. Decide whether it is a collection type or single type.
2. Define the minimum required fields.
3. Add relations only when the frontend actually needs them.
4. Keep names consistent with the frontend vocabulary.

For standard features, create the model first in the Strapi admin panel.
That lets Strapi generate the base API and schema files automatically.

## Relationship rule

Use a direct relation only when the relation itself has no business data.

If the relation needs fields such as:

- `role`
- `status`
- `joinedAt`
- `isOwner`

then create a dedicated join collection type instead of a plain many-to-many relation.

Examples:

- `group-membership` between `profile` and `group`
- a future `bookmark` entity between `profile` and `resource`
- a future `conversation-participant` entity for direct messages

## Where generated model files live

After a content-type change, Strapi writes schema files under:

```text
src/api/<feature>/content-types/<feature>/schema.json
```

These files are part of the project source and should be committed.

## Controller rule

Controllers should do only the following:

- receive the request
- read route params or request data
- call a service when custom logic is needed
- shape the response when necessary

Controllers should not become the main home for business logic.

## Service rule

Services are the correct place for:

- orchestration across multiple entities
- business validations
- reusable domain logic
- aggregation or transformation logic

If logic is likely to be reused or tested separately, it belongs in a service.

## Permissions rule

Do not leave new endpoints public by accident.

When a feature is added:

1. Review public permissions in the admin panel.
2. Decide whether the route is public, authenticated, or role-restricted.
3. Confirm the frontend behavior matches that permission model.

## Route design rule

Use Strapi-generated routes when they already satisfy the requirement.
Add custom routes only when:

- the frontend needs a custom response shape
- the behavior is not standard CRUD
- the endpoint coordinates multiple domain operations

## Validation rule

Validate at the right layer:

- schema-level rules for structural constraints
- service-level rules for business constraints
- permission rules for access constraints

Do not rely on frontend validation as the backend safeguard.

## Docker development rule

For local development:

- use `docker compose up --build`
- rebuild the image after dependency changes
- keep source changes in `src`, `config`, and Strapi-generated schema files

The current Docker setup preinstalls dependencies in the image with `npm ci`.
That is intentional because it improves reproducibility and reduces first-request instability.

## Dependency rule

Use:

```powershell
npm ci
```

when installing dependencies on the host machine from the committed lockfile.

Do not use ad hoc dependency changes without updating both:

- `package.json`
- `package-lock.json`

## TypeScript rule

Run:

```powershell
npm run typecheck
```

after meaningful backend config or custom TypeScript changes.

Generated Strapi types under `types/generated` should be treated as generated artifacts, not as the place for manual business logic.

## Recommended implementation order

For a new feature:

1. Model the content type.
2. Review generated schema files.
3. Review permissions.
4. Test generated CRUD if it is enough.
5. Add a custom service only if needed.
6. Add a custom controller or route only if needed.
7. Test from the browser, Postman, or the frontend.

## Anti-patterns to avoid

- putting all logic in controllers
- adding custom endpoints before checking generated CRUD
- changing `config` for feature-specific behavior
- leaving permissions open during development and forgetting to tighten them later
- editing generated files without understanding which tool regenerates them

## Practical rule of thumb

If the change is about data shape or fields, start with the content type.
If the change is about backend behavior, start with a service.
If the change is about startup or integration, inspect `config`, `.env`, Docker, or permissions.
