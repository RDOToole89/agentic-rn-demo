# AGENTS.md — Application Layer

> Use-case orchestration. Thin services that wire domain + infrastructure.
> Parent: [apps/server/AGENTS.md](../../AGENTS.md)

## Purpose

The application layer sits between the API (inbound adapter) and the domain +
infrastructure. It orchestrates use-cases: validate input via domain services,
call repositories for persistence, and return domain entities. It contains
**no HTTP concepts** (no Request/Response, no status codes) and **no SQL**.

## Constraint — Orchestration Only

Services here must be thin. Business rules live in `domain/services/`. Database
access lives in `infrastructure/database/repositories/`. Application services
just wire them together.

## Files

```
application/
├── AGENTS.md
└── services/
    └── preferences_service.py   # PreferencesService
```

## PreferencesService

| Method               | Flow                                                                     |
| -------------------- | ------------------------------------------------------------------------ |
| `get_preferences`    | validate user_id → repo.get → if None, create default → repo.save        |
| `update_preferences` | get current → validate changed fields → build updated entity → repo.save |
| `delete_preferences` | validate user_id → repo.delete                                           |

### Dependencies

- **Constructor**: takes a `PreferencesRepository` (injected via DI)
- **Imports from domain**: `UserPreferences`, `create_default_preferences`, `validate_user_id`, `validate_username`
- **Imports from infrastructure**: `PreferencesRepository`
- **Never imports from**: `api/`, `config/`

## Adding to This Layer

- New use-case? Add a service class in `services/`
- Keep methods short — delegate validation to domain, persistence to repos
- Raise `ValueError` for business rule violations (the API layer maps these to 400s)
