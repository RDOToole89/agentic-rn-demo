# AGENTS.md — Config Layer

> Application settings via Pydantic BaseSettings.
> Parent: [apps/server/AGENTS.md](../../AGENTS.md)

## Purpose

Centralized configuration using `pydantic-settings`. Values are loaded from
environment variables with `.env` file fallback. The `settings` singleton is
imported by infrastructure and API layers.

## Files

```
config/
├── AGENTS.md
└── settings.py   # Settings class + settings singleton
```

## Environment Files

| File                        | Committed? | Purpose                                 |
|-----------------------------|------------|-----------------------------------------|
| `apps/server/.env.example`  | Yes        | Template with all vars and documentation |
| `apps/server/.env`          | No         | Local overrides (gitignored)             |
| `apps/client/.env.example`  | Yes        | Client config template (API URL)         |
| `apps/client/.env`          | No         | Client local overrides (gitignored)      |

## Server Settings

| Field          | Type   | Default                  | Env Var          | Notes                       |
|----------------|--------|--------------------------|------------------|-----------------------------|
| `app_env`      | `str`  | `development`            | `APP_ENV`        | development / staging / production |
| `app_host`     | `str`  | `0.0.0.0`               | `APP_HOST`       | Bind address                |
| `app_port`     | `int`  | `8000`                   | `APP_PORT`       | Server port                 |
| `database_url` | `str`  | `sqlite:///./demo.db`    | `DATABASE_URL`   | SQLAlchemy connection string |
| `cors_origins` | `str`  | `http://localhost:8081,http://localhost:19006` | `CORS_ORIGINS` | Comma-separated origins or `*` |

### CORS Origins

`cors_origins` is stored as a comma-separated string and parsed via the
`cors_origin_list` property. Default allows Expo Metro (8081) and Expo Web
(19006). Set to `*` for allow-all during development.

## Client Settings

| Env Var                | Default                  | Notes                                |
|------------------------|--------------------------|--------------------------------------|
| `EXPO_PUBLIC_API_URL`  | `http://localhost:8000`  | Backend API base URL (no trailing /) |

The `EXPO_PUBLIC_` prefix makes the variable available in client-side JavaScript
via Expo's built-in dotenv support.

## Connecting Client to Server

```
apps/client/                          apps/server/
────────────                          ────────────
.env                                  .env
  EXPO_PUBLIC_API_URL ──────────────→   APP_HOST + APP_PORT
  = http://localhost:8000               = 0.0.0.0:8000

                                      CORS_ORIGINS must include
                                      the client's origin to allow
                                      cross-origin requests.
```

### Local Development Setup

1. `cd apps/server && cp .env.example .env`
2. `cd apps/client && cp .env.example .env`
3. Start server: `cd apps/server && uvicorn src.api.main:app --reload`
4. Start client: `pnpm -C apps/client dev`
5. Client calls `EXPO_PUBLIC_API_URL` → Server listens on `APP_PORT`

### Physical Device / Emulator

When running on a physical device or emulator, `localhost` won't reach the
host machine. Update the client `.env`:

```bash
# Android emulator (special alias for host loopback)
EXPO_PUBLIC_API_URL=http://10.0.2.2:8000

# Physical device (use your machine's LAN IP)
EXPO_PUBLIC_API_URL=http://192.168.1.XXX:8000
```

And ensure `CORS_ORIGINS` on the server includes the corresponding origin.

## Usage

```python
from src.config.settings import settings
print(settings.database_url)
print(settings.cors_origin_list)  # ['http://localhost:8081', 'http://localhost:19006']
```

## Adding Settings

1. Add a field to the `Settings` class with a type and default
2. Add the corresponding env var to `apps/server/.env.example` with a comment
3. Update this AGENTS.md settings table
4. pydantic-settings auto-maps `UPPER_SNAKE_CASE` env vars to `lower_snake_case` fields
