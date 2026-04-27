# ERD API Example

## Purpose

This document translates the provided ERD into a concrete API example for the ConnectTroca backend.
It is written as a Strapi-oriented contract example, not as a promise that every endpoint already exists.

The goal is to make the next implementation step clearer:

- which entities should become Strapi collection types
- which relations should exist
- which routes the frontend can expect
- what example request and response payloads should look like

## Important modeling decisions

### 1. `User` should not be a custom Strapi collection type

In Strapi, the authentication entity should remain:

```text
plugin::users-permissions.user
```

That means the ERD `User` entity is best implemented as:

- the built-in authenticated `user`
- plus an app-level `profile` content type for academic and social fields

This avoids duplicating login credentials in a second table.

### 2. `Comment` and `Like` are polymorphic in the ERD

The ERD says:

- a `Comment` can belong to a `Material` or a `Post`
- a `Like` can belong to a `Material`, `Post`, or `Comment`

That is acceptable as an ERD example, but it is not the cleanest Strapi implementation.

For a first version, there are two valid approaches:

1. keep one `comment` and one `like` entity and enforce that only one target relation is filled
2. split these into target-specific entities such as `material-comment`, `post-comment`, `material-like`, `post-like`, and `comment-like`

For simplicity, the API example below keeps the single-entity version, but the implementation note is explicit:
the service layer must validate that exactly one target relation is set.

## Recommended API entities

Use this mapping from the ERD to Strapi.

| ERD entity | Recommended Strapi model | Notes |
| --- | --- | --- |
| `User` | `plugin::users-permissions.user` + `profile` | Keep auth in Strapi plugin |
| `Material` | `material` | Standard collection type |
| `Area` | `area` | Standard collection type |
| `Topic` | `topic` | Standard collection type |
| `Post` | `post` | Forum replies |
| `Comment` | `comment` | Needs service validation for target |
| `Like` | `like` | Needs service validation for target |
| `Group` | `group` | Study group |
| `GroupMember` | `group-membership` | Join entity with metadata |

## Entity shape example

### `profile`

Recommended fields:

- `displayName`
- `course`
- `year`
- `bio`
- `level`
- `points`
- `registeredAt`
- `profilePhotoUrl`

Relations:

- one-to-one with `plugin::users-permissions.user`

### `area`

Recommended fields:

- `name`
- `description`

Relations:

- one-to-many with `material`
- one-to-many with `topic`
- one-to-many with `group`

### `material`

Recommended fields:

- `title`
- `description`
- `type`
- `publishedAt`
- `views`

Relations:

- many-to-one with `profile` as `author`
- many-to-one with `area`
- one-to-many with `comment`
- one-to-many with `like`

### `topic`

Recommended fields:

- `title`
- `description`
- `createdAtForum`

Relations:

- many-to-one with `profile` as `creator`
- many-to-one with `area`
- one-to-many with `post`

### `post`

Recommended fields:

- `content`
- `postedAt`

Relations:

- many-to-one with `profile` as `author`
- many-to-one with `topic`
- one-to-many with `comment`
- one-to-many with `like`

### `comment`

Recommended fields:

- `content`
- `commentedAt`

Relations:

- many-to-one with `profile` as `author`
- optional many-to-one with `material`
- optional many-to-one with `post`
- one-to-many with `like`

Rule:

- exactly one of `material` or `post` must be set

### `like`

Recommended relations:

- many-to-one with `profile`
- optional many-to-one with `material`
- optional many-to-one with `post`
- optional many-to-one with `comment`

Rule:

- exactly one of `material`, `post`, or `comment` must be set

### `group`

Recommended fields:

- `name`
- `description`
- `memberLimit`
- `location`
- `schedule`

Relations:

- many-to-one with `area`
- many-to-one with `profile` as `creator`
- one-to-many with `group-membership`

### `group-membership`

Recommended fields:

- `role`
- `joinedAt`

Relations:

- many-to-one with `group`
- many-to-one with `profile`

Business rule:

- one unique membership per `group + profile`

## Example route map

These are the main REST routes the frontend can consume.

### Profiles

- `GET /api/profiles`
- `GET /api/profiles/:id`
- `POST /api/profiles`
- `PUT /api/profiles/:id`

### Areas

- `GET /api/areas`
- `GET /api/areas/:id`
- `POST /api/areas`

### Materials

- `GET /api/materials`
- `GET /api/materials/:id`
- `POST /api/materials`
- `PUT /api/materials/:id`
- `DELETE /api/materials/:id`

### Topics

- `GET /api/topics`
- `GET /api/topics/:id`
- `POST /api/topics`
- `PUT /api/topics/:id`
- `DELETE /api/topics/:id`

### Posts

- `GET /api/posts`
- `GET /api/posts/:id`
- `POST /api/posts`
- `PUT /api/posts/:id`
- `DELETE /api/posts/:id`

### Comments

- `GET /api/comments`
- `GET /api/comments/:id`
- `POST /api/comments`
- `DELETE /api/comments/:id`

### Likes

- `GET /api/likes`
- `POST /api/likes`
- `DELETE /api/likes/:id`

### Groups

- `GET /api/groups`
- `GET /api/groups/:id`
- `POST /api/groups`
- `PUT /api/groups/:id`
- `DELETE /api/groups/:id`

### Group memberships

- `GET /api/group-memberships`
- `POST /api/group-memberships`
- `PUT /api/group-memberships/:id`
- `DELETE /api/group-memberships/:id`

## Example request payloads

### Create a profile

```json
POST /api/profiles
{
  "data": {
    "displayName": "Ana Costa",
    "course": "Engenharia Informatica",
    "year": 2,
    "bio": "Interesse em algoritmos e sistemas distribuidos",
    "level": 3,
    "points": 120,
    "registeredAt": "2026-04-21T09:00:00.000Z",
    "profilePhotoUrl": "https://example.com/avatar-ana.png",
    "user": 4
  }
}
```

### Create an area

```json
POST /api/areas
{
  "data": {
    "name": "Informatica",
    "description": "Conteudos de programacao, algoritmos e sistemas"
  }
}
```

### Create a material

```json
POST /api/materials
{
  "data": {
    "title": "Resumo de Estruturas de Dados",
    "description": "Resumo com listas, filas, pilhas e arvores",
    "type": "doc",
    "publishedAt": "2026-04-21T09:15:00.000Z",
    "views": 0,
    "author": 7,
    "area": 2
  }
}
```

### Create a forum topic

```json
POST /api/topics
{
  "data": {
    "title": "Duvida sobre complexidade assintotica",
    "description": "Quando devo preferir O(n log n) a O(n^2) neste problema?",
    "createdAtForum": "2026-04-21T09:30:00.000Z",
    "creator": 7,
    "area": 2
  }
}
```

### Create a post in a topic

```json
POST /api/posts
{
  "data": {
    "content": "Neste caso a diferenca fica mais evidente com conjuntos de dados maiores.",
    "postedAt": "2026-04-21T09:40:00.000Z",
    "author": 8,
    "topic": 15
  }
}
```

### Create a comment on a material

```json
POST /api/comments
{
  "data": {
    "content": "Este resumo ajudou bastante para a frequencia.",
    "commentedAt": "2026-04-21T09:50:00.000Z",
    "author": 8,
    "material": 11
  }
}
```

### Create a like on a post

```json
POST /api/likes
{
  "data": {
    "profile": 7,
    "post": 22
  }
}
```

### Create a study group

```json
POST /api/groups
{
  "data": {
    "name": "Algoritmos e Estruturas",
    "description": "Grupo de estudo para revisao semanal",
    "memberLimit": 30,
    "location": "Sala B204",
    "schedule": "Quarta 18:00",
    "area": 2,
    "creator": 7
  }
}
```

### Join a group

```json
POST /api/group-memberships
{
  "data": {
    "group": 5,
    "profile": 8,
    "role": "member",
    "joinedAt": "2026-04-21T10:00:00.000Z"
  }
}
```

## Example response payloads

### Get one material with author and area

```json
GET /api/materials/11?populate[author]=true&populate[area]=true
{
  "data": {
    "id": 11,
    "documentId": "oq3a3p6vhix1lt3m7qnd1f45",
    "title": "Resumo de Estruturas de Dados",
    "description": "Resumo com listas, filas, pilhas e arvores",
    "type": "doc",
    "publishedAt": "2026-04-21T09:15:00.000Z",
    "views": 42,
    "author": {
      "id": 7,
      "displayName": "Ana Costa",
      "course": "Engenharia Informatica",
      "year": 2
    },
    "area": {
      "id": 2,
      "name": "Informatica"
    }
  },
  "meta": {}
}
```

### Get one topic with posts

```json
GET /api/topics/15?populate[creator]=true&populate[area]=true&populate[posts][populate][author]=true
{
  "data": {
    "id": 15,
    "documentId": "c7mshk0i8kw44jm1h2h2n8l7",
    "title": "Duvida sobre complexidade assintotica",
    "description": "Quando devo preferir O(n log n) a O(n^2) neste problema?",
    "createdAtForum": "2026-04-21T09:30:00.000Z",
    "creator": {
      "id": 7,
      "displayName": "Ana Costa"
    },
    "area": {
      "id": 2,
      "name": "Informatica"
    },
    "posts": [
      {
        "id": 22,
        "content": "Neste caso a diferenca fica mais evidente com conjuntos de dados maiores.",
        "postedAt": "2026-04-21T09:40:00.000Z",
        "author": {
          "id": 8,
          "displayName": "Rui Silva"
        }
      }
    ]
  },
  "meta": {}
}
```

### Get one group with members

```json
GET /api/groups/5?populate[area]=true&populate[creator]=true&populate[group_memberships][populate][profile]=true
{
  "data": {
    "id": 5,
    "documentId": "m0ps93w32k5p9df0m2l1qp43",
    "name": "Algoritmos e Estruturas",
    "description": "Grupo de estudo para revisao semanal",
    "memberLimit": 30,
    "location": "Sala B204",
    "schedule": "Quarta 18:00",
    "area": {
      "id": 2,
      "name": "Informatica"
    },
    "creator": {
      "id": 7,
      "displayName": "Ana Costa"
    },
    "group_memberships": [
      {
        "id": 1,
        "role": "admin",
        "joinedAt": "2026-04-20T19:00:00.000Z",
        "profile": {
          "id": 7,
          "displayName": "Ana Costa"
        }
      },
      {
        "id": 2,
        "role": "member",
        "joinedAt": "2026-04-21T10:00:00.000Z",
        "profile": {
          "id": 8,
          "displayName": "Rui Silva"
        }
      }
    ]
  },
  "meta": {}
}
```

## Example service-level validation rules

These are not default Strapi rules.
They should be implemented in services or lifecycle hooks.

### `comment`

- reject requests with both `material` and `post`
- reject requests with neither `material` nor `post`

### `like`

- reject requests with more than one target among `material`, `post`, and `comment`
- reject requests with no target
- optionally enforce one like per `profile + target`

### `group-membership`

- reject duplicate memberships for the same `group + profile`
- enforce `memberLimit` before accepting a new membership

## Suggested implementation order

If you want to build this ERD incrementally in Strapi, use this order:

1. `profile`
2. `area`
3. `material`
4. `topic`
5. `post`
6. `group`
7. `group-membership`
8. `comment`
9. `like`

This order keeps the core academic content model stable before implementing the more validation-heavy polymorphic relations.

## Practical next step

If the next task is implementation rather than documentation, the correct first move is:

1. create `profile`
2. create `area`
3. create `material`
4. commit the generated Strapi schema files
5. only then move to `topic`, `post`, `group`, `comment`, and `like`
