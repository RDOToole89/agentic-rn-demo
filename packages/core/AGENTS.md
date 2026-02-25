# AGENTS.md — Package: core

## Purpose

Shared, zero-dependency TypeScript types, utilities, and **generated API client**
used by all apps in the monorepo. This package is a **leaf node** — it never
imports from `apps/*`.

## Stack

- **orval** — generates TypeScript types + React Query hooks from OpenAPI spec
- **@tanstack/react-query** — peer dependency for generated hooks
- Custom fetch mutator for React Native compatibility

## Files

| File / Folder           | Contains                                                      |
| ----------------------- | ------------------------------------------------------------- |
| `openapi.json`          | OpenAPI 3.1 spec — the API contract (source of truth)         |
| `src/types.ts`          | `Result<T, E>` type + `ok()` / `err()` constructors           |
| `src/fetcher.ts`        | Custom fetch wrapper used by generated hooks                  |
| `src/generated/models/` | Generated TypeScript interfaces (TeamMember, MoodEntry, etc.) |
| `src/generated/hooks/`  | Generated React Query hooks (useGetTeamMembers, etc.)         |

## OpenAPI Codegen Pipeline

```
openapi.json  →  pnpm generate:api  →  src/generated/
(spec)             (runs orval)          (types + hooks)
```

**To regenerate after spec changes:**

```bash
pnpm generate:api
```

**To pull spec from running FastAPI server:**

```bash
curl http://localhost:8000/openapi.json > packages/core/openapi.json
pnpm generate:api
```

## Generated Hooks (usage)

```typescript
import { useGetTeamMembers, useSubmitTeamMemberMood } from '@agentic-rn/core';

// Query — fully typed, auto-generates query keys
const { data, isLoading } = useGetTeamMembers();
// data is typed as TeamMember[]

// Mutation — typed request body + response
const mutation = useSubmitTeamMemberMood();
mutation.mutate({ id: '123', data: { emoji: '😊', label: 'happy' } });
```

## Boundary Rules

- **Never** import from `apps/*` — this package is consumed by apps, not the reverse
- **Never** edit files in `src/generated/` manually — they are overwritten by orval
- All hand-written code goes in `src/types.ts`, `src/fetcher.ts`, or new files outside `generated/`
- Generated files **are committed** to the repo (not gitignored)

## How to Add a New Endpoint

1. Add Pydantic model + route in FastAPI (`apps/server`)
2. Pull the updated OpenAPI spec: `curl http://localhost:8000/openapi.json > packages/core/openapi.json`
3. Run `pnpm generate:api`
4. Commit the updated `openapi.json` + generated files
5. Use the new hook in your feature — it's already typed
