---
id: STORY-03
title: Implement FastAPI Backend with Hexagonal Architecture
status: done
labels: [type:feat, scope:mono]
issue: 5
---

# STORY-03: Implement FastAPI Backend with Hexagonal Architecture

## Summary
Add a lightweight FastAPI backend (`apps/server`) demonstrating hexagonal
architecture (ports & adapters) as the API layer for the client app. This is
a demo-weight implementation — just enough structure to teach the pattern.

## Context
The demo needs a backend to show full-stack architecture-first development.
The hexagonal pattern mirrors the client's layered approach: domain is pure,
infrastructure is swappable, and boundaries are strict. Based on the pattern
used in `sommi-mono/apps/bff`, scaled down for a 30-minute talk.

## Target Structure

```
apps/server/
├── src/
│   ├── api/                          # ADAPTER: HTTP layer
│   │   ├── main.py                   # FastAPI app, middleware, router mount
│   │   └── v1/
│   │       ├── dependencies.py       # Depends() for DB session
│   │       ├── routes/
│   │       │   ├── health.py         # GET /health
│   │       │   └── preferences.py    # CRUD user preferences
│   │       └── schemas/
│   │           └── preference_schemas.py  # Request/response models
│   │
│   ├── application/                  # APPLICATION: Use-case orchestration
│   │   └── services/
│   │       └── preferences_service.py  # Thin orchestrator
│   │
│   ├── domain/                       # DOMAIN: Pure business logic
│   │   ├── models/
│   │   │   └── user_preferences.py   # Entity (no framework imports)
│   │   └── services/
│   │       └── validation.py         # Business rules (e.g. username length)
│   │
│   ├── infrastructure/               # ADAPTER: External services
│   │   └── database/
│   │       ├── connection.py         # SQLAlchemy engine + session factory
│   │       ├── models/
│   │       │   └── preferences_model.py  # SQLAlchemy ORM model
│   │       ├── repositories/
│   │       │   └── preferences_repo.py   # CRUD operations
│   │       └── mappers/
│   │           └── preferences_mapper.py # Domain <-> DB translation
│   │
│   └── config/
│       └── settings.py               # Pydantic BaseSettings from .env
│
├── pyproject.toml
├── .env.example
└── AGENTS.md                         # App-level agent guide
```

## Acceptance Criteria

- [x] `apps/server/` exists as a new workspace in the monorepo
- [x] FastAPI app starts with `uvicorn src.api.main:app --reload`
- [x] `GET /health` returns `{ "status": "ok" }`
- [x] `GET /api/v1/preferences/{user_id}` returns user preferences
- [x] `PUT /api/v1/preferences/{user_id}` updates preferences
- [x] Domain layer has zero framework imports (no FastAPI, no SQLAlchemy)
- [x] Infrastructure uses SQLite for zero-config demo setup
- [x] Mapper translates between domain model and DB model
- [x] Repository abstracts all database access
- [x] Pydantic Settings loads config from `.env`
- [x] AGENTS.md exists at `apps/server/AGENTS.md`
- [x] Root AGENTS.md navigation table updated

## Constraints

- **SQLite only** — no PostgreSQL setup for the demo
- **No auth** — keep it simple, auth is out of scope
- **No migrations** — use `create_all()` for demo simplicity
- **One entity** — user preferences (mirrors the client feature)
- **No async** — sync SQLAlchemy for simplicity (can mention async as extension)
- Domain must be **pure Python** — no imports from `infrastructure/` or `api/`

## Key Patterns to Demonstrate

| Pattern | Where | Why |
|---------|-------|-----|
| Hexagonal architecture | Folder structure | Swappable adapters, testable core |
| Repository pattern | `infrastructure/database/repositories/` | Abstract DB access |
| Mapper pattern | `infrastructure/database/mappers/` | Domain <-> DB translation |
| Dependency injection | `api/v1/dependencies.py` | FastAPI `Depends()` |
| Pydantic Settings | `config/settings.py` | Type-safe config from env |
| Domain purity | `domain/` has no framework imports | Testable, portable logic |

## Out of Scope

- Authentication / authorization
- Alembic migrations
- Docker / deployment config
- WebSocket endpoints
- AI/LLM integration
- Multiple entities beyond preferences
- Async database operations
- Test setup (separate story)

## Notes for Presenter

This backend pairs with the client app's Settings feature. The data flow:

```
Client (Expo)                    Server (FastAPI)
SettingsScreen                   PUT /api/v1/preferences/{id}
  → useSettings hook               → route handler
    → Zustand store                   → preferences_service
      → AsyncStorage (local)            → domain validation
                                          → repository → SQLite
```

During the demo, show how both apps share the same architectural philosophy:
pure domain, interface boundaries, self-documenting structure via AGENTS.md.
