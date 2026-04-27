# Entity Relationship Blueprint

## Purpose

This document defines the recommended first-pass data model for the ConnectTroca backend.
It exists to make future Strapi development predictable, especially for junior engineers who need a clear starting point.

This is a blueprint, not a claim that every entity must be implemented immediately.
The goal is to establish the right model boundaries before feature work starts.

## Core design rules

- Keep authentication in `plugin::users-permissions.user`.
- Create an app-level `profile` entity for user-facing data.
- Use dedicated join entities when the relationship itself has business data.
- Prefer simple one-to-many relations before introducing polymorphic or highly generic models.
- Do not create a content type for every screen. Some screens are service-level aggregations.

## Recommended phase 1 entities

### `profile`

Purpose:
- stores application profile data separate from authentication credentials

Recommended fields:
- `displayName`
- `bio`
- `avatarUrl`
- `course`
- `campus`
- `interests`

Recommended relations:
- one-to-one with `plugin::users-permissions.user`
- one-to-many with `group-membership`
- one-to-many with `resource`
- one-to-many with `forum-topic`
- one-to-many with `forum-post`
- one-to-many with `group-message`

### `group`

Purpose:
- represents study groups or community groups shown in the frontend

Recommended fields:
- `name`
- `slug`
- `summary`
- `visibility`
- `status`

Recommended relations:
- many-to-one with `profile` as `owner`
- one-to-many with `group-membership`
- one-to-many with `resource`
- one-to-many with `group-message`
- one-to-many with `forum-topic` when topics are group-scoped

### `group-membership`

Purpose:
- join entity between `profile` and `group`

Why this should be a real entity:
- membership has its own data such as role and join date
- a direct many-to-many relation would lose that metadata

Recommended fields:
- `role`
- `status`
- `joinedAt`

Recommended relations:
- many-to-one with `profile`
- many-to-one with `group`

### `resource`

Purpose:
- learning materials, links, files, or documents

Recommended fields:
- `title`
- `slug`
- `description`
- `resourceType`
- `externalUrl`
- `publishedAtExternal`

Recommended relations:
- many-to-one with `profile` as `author`
- optional many-to-one with `group`

Implementation note:
- keep tags simple at first
- if tags later need moderation or search logic, create a dedicated `resource-tag` entity

### `forum-category`

Purpose:
- optional top-level organization for forum content

Recommended fields:
- `name`
- `slug`
- `description`

Recommended relations:
- one-to-many with `forum-topic`

### `forum-topic`

Purpose:
- main discussion thread entity for the forum area

Recommended fields:
- `title`
- `slug`
- `body`
- `status`
- `isPinned`

Recommended relations:
- many-to-one with `profile` as `author`
- optional many-to-one with `forum-category`
- optional many-to-one with `group`
- one-to-many with `forum-post`

### `forum-post`

Purpose:
- replies inside a `forum-topic`

Recommended fields:
- `body`

Recommended relations:
- many-to-one with `forum-topic`
- many-to-one with `profile` as `author`

Implementation note:
- keep nested replies out of phase 1 unless the frontend explicitly needs them
- if threaded replies become necessary, add a self-relation later

### `group-message`

Purpose:
- chat messages inside a group

Recommended fields:
- `body`
- `messageType`

Recommended relations:
- many-to-one with `group`
- many-to-one with `profile` as `author`

Implementation note:
- keep attachments as a later step unless the frontend already depends on them

## Phase 2 entities

These should be added only when the frontend or business rules require them:

- `resource-tag`
- `forum-reaction`
- `group-message-attachment`
- `notification`
- `bookmark`

Use the same rule every time:
if the relation needs its own fields, model it as a real collection type.

## Future direct-message model

If private chat is added later, do not model it as a single many-to-many shortcut.

Use:

- `direct-conversation`
- `direct-conversation-participant`
- `direct-message`

This keeps participants, message history, and future metadata manageable.

## Relationship map

Use this as the baseline relationship map:

```text
plugin::users-permissions.user 1--1 profile
profile 1--* group-membership *--1 group
profile 1--* resource
group 1--* resource
forum-category 1--* forum-topic
profile 1--* forum-topic
group 1--* forum-topic
forum-topic 1--* forum-post
profile 1--* forum-post
group 1--* group-message
profile 1--* group-message
```

## Service-level views that should not be stored as entities

Do not create content types for these immediately:

- dashboard summary cards
- homepage aggregations
- profile overview widgets

These are usually composed in services from existing entities.

## Recommended implementation waves

### Wave 1. Identity and community

Implement:
- `profile`
- `group`
- `group-membership`

This creates the base relation model for users and communities.

### Wave 2. Content

Implement:
- `resource`
- `forum-category`
- `forum-topic`
- `forum-post`

This supports forum and resource screens with simple author relations.

### Wave 3. Realtime-style communication

Implement:
- `group-message`

This should come after groups and profiles are stable.

### Wave 4. Secondary behaviors

Implement only when required:
- tags
- bookmarks
- reactions
- notifications
- direct messages

## Strapi-specific modeling advice

- Start new entities in the Strapi admin panel so schema files are generated correctly.
- Commit generated `schema.json` files after every content-type change.
- Review permissions immediately after adding a new collection type.
- Populate only the relations the frontend actually needs.
- Avoid circular overpopulation between entities because it makes responses noisy and harder to stabilize.

## Folder targets for future development

The likely first folders under `src/api` are:

```text
src/api/profile
src/api/group
src/api/group-membership
src/api/resource
src/api/forum-category
src/api/forum-topic
src/api/forum-post
src/api/group-message
```

## Practical rule

If the frontend feature is asking for a real domain object, create or extend an entity.
If the frontend feature is asking for a summary, ranking, or dashboard card, implement it in a service first rather than inventing a new content type.
