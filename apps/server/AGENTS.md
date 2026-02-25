# AGENTS.md — Server (FastAPI)

> App-level agent guide for the Python backend.
> Parent: [root AGENTS.md](../../AGENTS.md)

## Stack

| Layer          | Technology                        |
|----------------|-----------------------------------|
| Framework      | FastAPI                           |
| ORM            | SQLAlchemy 2.x (DeclarativeBase)  |
| Config         | pydantic-settings                 |
| Database       | SQLite (dev), swappable via URL   |
| Server         | Uvicorn                           |

## Architecture (Hexagonal)

```
┌─────────────────────────────────────────────┐
│  src/api/           HTTP Adapter (FastAPI)   │  ← Routes, schemas, DI
├─────────────────────────────────────────────┤
│  src/application/   Use-Case Orchestration   │  ← Service layer
├─────────────────────────────────────────────┤
│  src/domain/        Business Logic           │  ← Pure Python, zero imports
├─────────────────────────────────────────────┤
│  src/infrastructure/ DB Adapter (SQLAlchemy) │  ← ORM, repos, mappers
├─────────────────────────────────────────────┤
│  src/config/        Settings                 │  ← Pydantic BaseSettings
└─────────────────────────────────────────────┘
```

## Dependency Rule

Arrows point inward. Domain depends on nothing. Infrastructure implements
domain interfaces. API depends on application; application depends on domain
and infrastructure.

## Relationship to Client (`apps/client/`)

The server is the API backend for the Expo client app. Both sides share the
same `UserPreferences` concept with mirrored domain models:

| Field          | Client (TypeScript)       | Server (Python)          |
|----------------|---------------------------|--------------------------|
| username       | `username: string`        | `username: str`          |
| dark mode      | `darkMode: boolean`       | `dark_mode: bool`        |
| user ID        | _(not yet on client)_     | `user_id: str`           |
| timestamps     | _(not yet on client)_     | `created_at`, `updated_at` |

The server extends the client model with `user_id` (multi-user support) and
timestamps. The API uses `snake_case` JSON fields.

### Data Flow (Client → Server)

```
Expo App                              FastAPI Server
────────                              ──────────────
SettingsScreen
  → useSettings hook
    → Zustand store
      → lib/utils/storage              (today: AsyncStorage)
      → api/ React Query (future) ──→  GET/PUT /api/v1/preferences/{user_id}
                                           → PreferencesService
                                             → PreferencesRepository
                                               → SQLite
```

The client currently persists to AsyncStorage via `lib/utils/storage`. A future
story will add React Query hooks in the client `api/` layer that call these
server endpoints, enabling sync between devices.

### API Contract

| Endpoint                          | Method | Request Body                          | Response                              |
|-----------------------------------|--------|---------------------------------------|---------------------------------------|
| `/health`                         | GET    | —                                     | `{"status": "ok"}`                    |
| `/api/v1/preferences/{user_id}`   | GET    | —                                     | `PreferenceResponse` (full entity)    |
| `/api/v1/preferences/{user_id}`   | PUT    | `{"username?", "dark_mode?"}`         | `PreferenceResponse` (updated entity) |

Interactive docs: `GET /docs` (Swagger UI) or `GET /redoc` (ReDoc).

### Type Safety and Schema Drift Prevention

The same data shape flows through four layers across two languages. Schema drift
between any of them causes silent bugs. Every layer has its own typed
representation and they must stay in sync:

```
Client (TypeScript)              Server (Python)
───────────────────              ───────────────
UserPreferences (interface)  ↔   UserPreferences (dataclass)     ← domain
                                 PreferencesModel (ORM)          ← infrastructure
                                 PreferenceResponse (Pydantic)   ← API schema
```

**Rules to prevent drift**:

1. **Domain is the source of truth** — both client and server domain models
   define the canonical shape. When a field is added or renamed, update both
   `apps/client/src/lib/types/preferences.ts` and
   `apps/server/src/domain/models/user_preferences.py` in the same PR.
2. **ORM mirrors domain** — `PreferencesModel` fields must match
   `UserPreferences` dataclass fields 1:1. The mapper will break at runtime
   if they diverge.
3. **API schema mirrors domain** — `PreferenceResponse` uses
   `from_attributes=True` to serialize directly from the dataclass. Adding a
   domain field without adding it to the schema means it silently disappears
   from the API response.
4. **Mappers are the canary** — `to_domain()` / `to_model()` do explicit
   field-by-field mapping. If a field is added to one side but not the other,
   the mapper fails with a `TypeError` immediately — not silently.
5. **One PR, all layers** — never merge a change that touches the domain model
   in only one layer. A field change must update: domain entity, ORM model,
   mapper, API schema, and the corresponding client type.

## Folder Structure

```
apps/server/
├── pyproject.toml
├── .env.example
├── AGENTS.md
└── src/
    ├── api/
    │   ├── main.py                      # FastAPI app, CORS, lifespan
    │   └── v1/
    │       ├── dependencies.py          # DI chain: db → repo → service
    │       ├── schemas/
    │       │   └── preference_schemas.py
    │       └── routes/
    │           ├── health.py            # GET /health
    │           └── preferences.py       # GET/PUT /api/v1/preferences/{user_id}
    ├── application/
    │   └── services/
    │       └── preferences_service.py   # Use-case orchestrator
    ├── config/
    │   └── settings.py                  # Pydantic BaseSettings
    ├── domain/
    │   ├── models/
    │   │   └── user_preferences.py      # Dataclass entity + factory
    │   └── services/
    │       └── validation.py            # Username/user-id validation
    └── infrastructure/
        └── database/
            ├── connection.py            # Engine, SessionLocal, Base
            ├── mappers/
            │   └── preferences_mapper.py
            ├── models/
            │   └── preferences_model.py # SQLAlchemy ORM model
            └── repositories/
                └── preferences_repo.py  # get_by_user_id, save, delete
```

## Navigation for Agents

| I need to...                        | Go to                                        |
|-------------------------------------|----------------------------------------------|
| Understand the domain entities      | `src/domain/AGENTS.md`                       |
| Work on database / persistence      | `src/infrastructure/AGENTS.md`               |
| Add or modify API endpoints         | `src/api/AGENTS.md`                          |
| Add a use-case / service            | `src/application/AGENTS.md`                  |
| Change app settings                 | `src/config/AGENTS.md`                       |

## Decision Tree

| I need to...                        | Do this                                      |
|-------------------------------------|----------------------------------------------|
| Add a new entity                    | `domain/models/` — pure dataclass            |
| Add validation rules                | `domain/services/` — pure functions           |
| Add a new DB table                  | `infrastructure/database/models/`             |
| Add a new repository                | `infrastructure/database/repositories/`       |
| Add a new endpoint                  | `api/v1/routes/` + schema + dependency        |
| Add a new use-case                  | `application/services/`                       |
| Change DB config                    | `config/settings.py` + `.env`                 |

## Key Commands

```bash
cd apps/server
python -m venv .venv && source .venv/bin/activate
pip install -e .
uvicorn src.api.main:app --reload
```

## Naming Conventions

- Files: `snake_case.py`
- Classes: `PascalCase`
- Domain entities: dataclasses in `domain/models/`
- ORM models: `{Name}Model` in `infrastructure/database/models/`
- Schemas: `{Name}Response`, `{Name}Update` in `api/v1/schemas/`
- Routes: grouped by resource in `api/v1/routes/`
