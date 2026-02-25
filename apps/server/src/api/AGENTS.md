# AGENTS.md — API Layer

> HTTP adapter. FastAPI routes, Pydantic schemas, dependency injection.
> Parent: [apps/server/AGENTS.md](../../AGENTS.md)

## Purpose

The API layer is the **inbound adapter** of the hexagonal architecture. It
translates HTTP requests into application service calls and domain entities
into JSON responses. All FastAPI-specific code lives here.

## OpenAPI Documentation

FastAPI auto-generates interactive API docs:

- **Swagger UI**: `GET /docs`
- **ReDoc**: `GET /redoc`
- **OpenAPI JSON**: `GET /openapi.json`

These are available automatically — no extra configuration needed.

## Route Versioning

All resource endpoints are versioned under `/api/v1/`. Infrastructure endpoints
(health checks) are unversioned at the root.

| Endpoint                        | Method | Description                |
| ------------------------------- | ------ | -------------------------- |
| `/health`                       | GET    | Health check (unversioned) |
| `/api/v1/preferences/{user_id}` | GET    | Get or create preferences  |
| `/api/v1/preferences/{user_id}` | PUT    | Update preferences         |

## Files

```
api/
├── AGENTS.md
├── main.py                        # FastAPI app, CORS, lifespan, router mounts
└── v1/
    ├── dependencies.py            # DI chain: get_db → get_repo → get_service
    ├── schemas/
    │   └── preference_schemas.py  # PreferenceResponse, PreferenceUpdate
    └── routes/
        ├── health.py              # GET /health
        └── preferences.py         # GET/PUT /api/v1/preferences/{user_id}
```

## Main App (`main.py`)

- Creates the `FastAPI` instance with title and version
- Adds CORS middleware (origins configurable via `CORS_ORIGINS` env var)
- Uses `lifespan` context manager to call `create_tables()` on startup
- Mounts all route routers

## Dependency Injection (`v1/dependencies.py`)

DI chain wired via FastAPI `Depends`:

```
Route handler
  └── service = _get_service(db)
        └── repo = get_preferences_repo(db)
              └── db = get_db()  → SessionLocal()
```

Each route defines a `_get_service` helper that assembles the chain. The `db`
session is yielded and closed automatically after the request.

## Schemas (`v1/schemas/`)

- `PreferenceResponse` — output schema, uses `ConfigDict(from_attributes=True)` to serialize domain dataclasses
- `PreferenceUpdate` — input schema, all fields optional (partial update)
- Named `{Resource}Response` / `{Resource}Update`

## Routes (`v1/routes/`)

- One file per resource, each exports a `router = APIRouter()`
- Routes catch `ValueError` from services and map to `HTTPException(400)`
- Use `response_model` for automatic OpenAPI schema generation
- Route functions are thin: extract params → call service → return schema

## Adding to This Layer

- New resource? Add schema in `schemas/`, route file in `routes/`, DI in `dependencies.py`
- Mount the new router in `main.py` via `app.include_router()`
- New API version? Create `v2/` directory mirroring `v1/` structure
- Keep routes thin — no business logic, no direct DB access
