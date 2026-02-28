Last updated: 2026-02-25

> Database adapter. Translates between domain entities and SQLAlchemy ORM.
> Parent: [apps/server/AGENTS.md](../../AGENTS.md)

## Purpose

The infrastructure layer is an **outward-facing adapter** in the hexagonal
architecture. It implements persistence using SQLAlchemy 2.x and SQLite. The
domain layer never imports from here — instead, the application layer wires
infrastructure into domain workflows via dependency injection.

## Constraint — SQLAlchemy 2.x Style

Use the modern `DeclarativeBase` + `Mapped[]` + `mapped_column()` API.
Never use the legacy `declarative_base()` function or untyped `Column()`.

## Files

```
infrastructure/
├── AGENTS.md
└── database/
    ├── connection.py              # Engine, SessionLocal, Base, create_tables()
    ├── models/
    │   └── preferences_model.py   # PreferencesModel (ORM)
    ├── mappers/
    │   └── preferences_mapper.py  # to_domain() / to_model()
    └── repositories/
        └── preferences_repo.py    # PreferencesRepository (CRUD)
```

## Connection (`database/connection.py`)

- `engine` — SQLAlchemy engine with `check_same_thread=False` for SQLite
- `SessionLocal` — session factory (autocommit=False, autoflush=False)
- `Base` — `DeclarativeBase` subclass, all ORM models inherit from this
- `create_tables()` — imports all models then calls `Base.metadata.create_all()`

**Gotcha**: ORM models must be imported before `create_tables()` runs, otherwise
SQLAlchemy won't know about them. The import happens inside the function body.

## Models (`database/models/`)

- ORM classes named `{Entity}Model` (e.g., `PreferencesModel`)
- Map 1:1 to database tables
- Use `Mapped[type]` annotations with `mapped_column()` for all columns
- Never used directly outside infrastructure — always go through mappers

## Mappers (`database/mappers/`)

- `to_domain(model) -> Entity` — ORM model to domain dataclass
- `to_model(entity) -> Model` — domain dataclass to ORM model
- Keep mappers as simple field-by-field copies, no business logic

## Repositories (`database/repositories/`)

- One repository per aggregate root
- Constructor takes a `Session` (injected via FastAPI `Depends`)
- Methods: `get_by_user_id()`, `save()` (upsert), `delete()`
- `save()` checks for existing record: insert if new, update fields if exists
- Always `commit()` + `refresh()` after writes

## Adding to This Layer

- New table? Add ORM model in `models/`, mapper in `mappers/`, repo in `repositories/`
- Import the new model inside `create_tables()` so it registers with `Base`
- Repos may import from `domain/models/` but never from `api/` or `application/`
