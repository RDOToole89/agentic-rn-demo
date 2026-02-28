---
id: STORY-11
title: Type-Safe API Contract Layer (OpenAPI + Orval)
status: backlog
labels: [type:feat, scope:core]
issue: 13
last_updated: 2026-02-26
---

# STORY-11: Type-Safe API Contract Layer (OpenAPI + Orval)

## Summary

Set up an industry-standard OpenAPI code generation pipeline using **orval** to
generate fully typed React Query hooks, TypeScript types, and a fetch client
from the FastAPI backend's OpenAPI spec. Python Pydantic models are the single
source of truth — TypeScript types are generated, never hand-written.

## Context

FastAPI automatically generates an OpenAPI 3.1 spec from Pydantic models. This
story uses **orval** to consume that spec and generate:

1. TypeScript interfaces for all request/response shapes
2. React Query `useQuery` / `useMutation` hooks with full type inference
3. A typed fetch client with AbortSignal support

This is the industry standard approach (used by Stripe, GitHub, etc.) and the
best fit for our stack (FastAPI + React Query + React Native). It eliminates
manual type sync between Python and TypeScript entirely.

**Pipeline:**

```
Pydantic models (Python)  →  OpenAPI spec (JSON)  →  orval  →  TS types + React Query hooks
     source of truth            auto-generated          codegen        generated output
```

## Depends On

- STORY-03 (FastAPI Backend) — we need the OpenAPI spec to generate from.
  However, we can bootstrap with a hand-written `openapi.json` spec and swap
  to the live server spec once STORY-03 lands.

## Unblocks

- STORY-05 (Team Pulse Dashboard) — generated types used for mock data shape
- STORY-09 (Connect frontend to API) — generated hooks replace mock queryFn

## Acceptance Criteria

- [ ] `orval` installed as a dev dependency at the monorepo root
- [ ] `orval.config.ts` at monorepo root configures generation
- [ ] OpenAPI spec (JSON) committed at `packages/core/openapi.json` as the
      contract document (initially hand-written, later pulled from server)
- [ ] Generated types output to `packages/core/src/generated/models/`
- [ ] Generated React Query hooks output to `packages/core/src/generated/hooks/`
- [ ] Generated fetch client output to `packages/core/src/generated/client/`
- [ ] Custom fetch mutator in `packages/core/src/fetcher.ts` with:
  - Configurable base URL via `EXPO_PUBLIC_API_URL` env var
  - `ApiError` class with status code and body
  - AbortSignal threading for React Query cancellation
- [ ] `packages/core/src/index.ts` re-exports all generated types and hooks
- [ ] `pnpm generate:api` script runs orval codegen
- [ ] `pnpm typecheck` passes across all packages after generation
- [ ] `@agentic-rn/core` added as workspace dependency to `apps/client`
- [ ] `packages/core/AGENTS.md` documents the OpenAPI codegen pipeline
- [ ] `apps/client/AGENTS.md` updated with generated hook usage patterns
- [ ] Root `AGENTS.md` navigation table includes `packages/core`
- [ ] `.gitignore` does NOT ignore generated files — they are committed

## OpenAPI Spec (Bootstrap)

Until STORY-03 delivers the live FastAPI server, we commit a hand-written
`openapi.json` that defines the contract for all planned endpoints:

- `GET /health` → `{ status: string }`
- `GET /api/v1/preferences/{userId}` → `UserPreferences`
- `PUT /api/v1/preferences/{userId}` → `UserPreferences`
- `GET /api/v1/team` → `TeamMember[]`
- `GET /api/v1/team/{id}` → `TeamMember`
- `POST /api/v1/team/{id}/mood` → `MoodEntry`

Once the FastAPI server exists, replace the hand-written spec with:

```bash
curl http://localhost:8000/openapi.json > packages/core/openapi.json
pnpm generate:api
```

## Orval Configuration

```typescript
// orval.config.ts
import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: './packages/core/openapi.json',
    output: {
      target: './packages/core/src/generated/hooks',
      schemas: './packages/core/src/generated/models',
      client: 'react-query',
      httpClient: 'fetch',
      mode: 'tags-split',
      override: {
        mutator: {
          path: './packages/core/src/fetcher.ts',
          name: 'customFetch',
        },
        query: {
          useQuery: true,
          useMutation: true,
          signal: true,
        },
      },
    },
  },
});
```

## Target Structure

```
packages/core/
├── openapi.json                     # OpenAPI 3.1 spec (source of truth)
├── AGENTS.md                        # Documents codegen pipeline
├── src/
│   ├── types.ts                     # (existing) Result<T, E>
│   ├── fetcher.ts                   # Custom fetch wrapper for orval
│   ├── generated/                   # orval output (committed, not gitignored)
│   │   ├── models/                  # Generated TypeScript interfaces
│   │   │   ├── teamMember.ts
│   │   │   ├── moodEntry.ts
│   │   │   ├── userPreferences.ts
│   │   │   └── index.ts
│   │   └── hooks/                   # Generated React Query hooks
│   │       ├── team.ts              # useGetTeam, useGetTeamById, usePostTeamMood
│   │       ├── preferences.ts       # useGetPreferences, usePutPreferences
│   │       └── health.ts            # useGetHealth
│   └── index.ts                     # Re-exports generated + hand-written types
```

## Files Touched

| File                           | Action             | Layer         |
| ------------------------------ | ------------------ | ------------- |
| `orval.config.ts`              | Create             | Config (root) |
| `package.json` (root)          | Modify             | Config        |
| `packages/core/openapi.json`   | Create             | Core          |
| `packages/core/src/fetcher.ts` | Create             | Core          |
| `packages/core/src/generated/` | Create (generated) | Core          |
| `packages/core/src/index.ts`   | Modify             | Core          |
| `packages/core/AGENTS.md`      | Create             | Docs          |
| `apps/client/package.json`     | Modify             | Config        |
| `apps/client/AGENTS.md`        | Modify             | Docs          |
| `AGENTS.md`                    | Modify             | Docs          |
| `pnpm-lock.yaml`               | Modify             | Config        |

## Constraints

- `orval` as the sole codegen tool — no openapi-typescript, no swagger-codegen
- Generated files are **committed** to the repo (not gitignored) so AI agents
  and developers can read them without running codegen
- Custom fetch mutator (not axios) — React Native compatible
- `packages/core` remains a leaf node — never imports from `apps/*`
- When STORY-03 lands, the hand-written spec is replaced by the server's live spec

## Workflow: Adding a New Endpoint

1. Add Pydantic model + route in FastAPI (`apps/server`)
2. Pull the updated OpenAPI spec:
   `curl http://localhost:8000/openapi.json > packages/core/openapi.json`
3. Run `pnpm generate:api`
4. Commit the updated spec + generated files
5. Use the new generated hook in your feature

## Out of Scope

- CI pipeline to auto-generate on spec changes (future improvement)
- Mock server generation from OpenAPI spec (orval supports this but not needed yet)
- Runtime response validation (Pydantic validates server-side)
- Custom query key factories (orval generates these automatically)

## Testing Notes

- `pnpm generate:api` runs without errors
- `pnpm typecheck` passes across all workspaces
- Generated hooks have correct return types (e.g., `useGetTeam` returns `TeamMember[]`)
- Generated types match the OpenAPI spec exactly
- Custom fetcher handles errors and returns proper `ApiError`
- `pnpm dev` — app starts without import errors
