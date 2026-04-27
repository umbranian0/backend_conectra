# API Feature Area

This folder is the default home for project business features.

Current module:

- `health`

Expected next modules:

- `profile`
- `group`
- `group-membership`
- `resource`
- `forum-category`
- `forum-topic`
- `forum-post`
- `group-message`

Rules:

- model the content type in the Strapi admin panel first
- commit generated `schema.json` files
- keep controllers thin
- place business logic in services
- use dedicated join entities when the relation has its own fields

Read `docs/ENTITY_RELATIONSHIP_BLUEPRINT.md` before creating the next module.
