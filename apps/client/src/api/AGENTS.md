# AGENTS.md — API Layer

Last updated: 2026-02-26

## Purpose

This directory is the client-side API layer — it configures React Query and
defines query key factories. It does **not** contain fetch logic or generated
hooks directly; those live in `@agentic-rn/core`.

## Files

| File             | Role                                                  |
| ---------------- | ----------------------------------------------------- |
| `queryClient.ts` | Shared `QueryClient` instance (1min stale, 2 retries) |
| `keys.ts`        | Query key factories for cache management              |
| `index.ts`       | Barrel re-export of `queryClient` and `queryKeys`     |

## How the API Connection Works

```
Feature hook (e.g. useTeamMembers)
  → uses @tanstack/react-query with queryKeys from src/api/keys.ts
  → calls a fetch function (currently mock, will use generated hooks)
  → QueryClient from src/api/queryClient.ts manages cache

Future (live backend):
  Feature hook
    → @agentic-rn/core generated hooks (from orval + OpenAPI spec)
    → customFetch (packages/core/src/fetcher.ts)
    → FastAPI backend at EXPO_PUBLIC_API_URL (default: localhost:8000/api/v1)
```

### Key pieces across the monorepo

| Layer           | Location                              | Role                                       |
| --------------- | ------------------------------------- | ------------------------------------------ |
| Query client    | `src/api/queryClient.ts`              | Configures caching, retries, stale time    |
| Query keys      | `src/api/keys.ts`                     | Centralized key factories for invalidation |
| Generated hooks | `@agentic-rn/core` (`packages/core/`) | Orval-generated React Query hooks + types  |
| Fetch mutator   | `packages/core/src/fetcher.ts`        | Base URL, headers, error wrapping          |
| OpenAPI spec    | `packages/core/openapi.json`          | Contract between client and server         |
| Backend         | `apps/server/`                        | FastAPI, serves `/api/v1/*`                |

### Current state

Feature hooks (`useTeamMembers`, etc.) currently use **mock data** with
simulated delays. The generated hooks in `@agentic-rn/core` are ready but
not yet wired in — the switch happens by replacing the mock fetch function
with the generated one from core.

### Query key conventions

Keys use a nested factory pattern for easy invalidation:

```ts
queryKeys.team.all; // ['team']        — all team queries
queryKeys.team.detail(id); // ['team', id]    — single member
```

## Constraints

- `QueryClient` is instantiated once and provided via `QueryClientProvider` in `app/_layout.tsx`
- Feature hooks import `queryKeys` from here — never hardcode key strings
- No direct `fetch()` calls in features — always go through React Query
- Base URL comes from `EXPO_PUBLIC_API_URL` env var (see `packages/core/src/fetcher.ts`)
