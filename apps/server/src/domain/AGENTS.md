# AGENTS.md — Domain Layer

> Pure business logic. Zero framework imports.
> Parent: [apps/server/AGENTS.md](../../AGENTS.md)

## Purpose

The domain layer is the innermost ring of the hexagonal architecture. It defines
entities (data shapes) and validation rules. It has **no dependencies** on
FastAPI, SQLAlchemy, Pydantic, or any other framework.

## Constraint — Domain Purity

```
grep -r "from fastapi\|from sqlalchemy\|from pydantic" src/domain/
# Must produce no output
```

Only standard library imports are allowed (`dataclasses`, `datetime`, `re`, etc.).
This ensures the domain is testable in isolation and portable across frameworks.

## Files

```
domain/
├── AGENTS.md
├── models/
│   └── user_preferences.py   # UserPreferences dataclass + create_default_preferences()
└── services/
    └── validation.py          # validate_username(), validate_user_id()
```

## Models (`models/`)

- Pure `@dataclass` entities — no ORM, no Pydantic `BaseModel`
- Each entity has a factory function for creating default instances
- Fields use standard Python types (`str`, `bool`, `datetime`)

### UserPreferences

| Field        | Type       | Notes                        |
|--------------|------------|------------------------------|
| `user_id`    | `str`      | Primary identifier           |
| `username`   | `str`      | Display name, default "Guest"|
| `dark_mode`  | `bool`     | UI preference                |
| `created_at` | `datetime` | UTC, set on creation         |
| `updated_at` | `datetime` | UTC, set on every mutation   |

## Services (`services/`)

- Pure validation functions that raise `ValueError` on invalid input
- Return the cleaned/validated value on success
- No side effects, no I/O

### Validation Rules

| Function            | Rules                                              |
|---------------------|----------------------------------------------------|
| `validate_username` | Non-empty after strip, max 50 chars                |
| `validate_user_id`  | Alphanumeric + hyphens + underscores, max 100 chars|

## Adding to This Layer

- New entity? Add a dataclass in `models/` with a factory function
- New validation? Add a pure function in `services/` that raises `ValueError`
- Never import from `infrastructure/`, `api/`, `application/`, or `config/`
