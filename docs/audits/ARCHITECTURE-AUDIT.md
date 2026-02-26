# Architecture Audit

Last updated: 2026-02-26

> Full-stack architecture assessment of the agentic-rn-demo monorepo.
> Covers client (React Native/Expo), server (FastAPI), and monorepo tooling.

---

## Executive Summary

This codebase demonstrates **excellent architectural discipline** for an
early-stage project. Clean layer separation, proper state management patterns,
and a well-designed hexagonal backend. The biggest gaps are **zero test coverage**
and **missing error handling infrastructure** — both documented as requirements
in CLAUDE.md but not yet implemented.

**Overall Score: 7.8/10** — strong foundation, needs testing and error handling
before production.

---

## Scorecard

| Area               | Score | Verdict                                           |
| ------------------ | ----- | ------------------------------------------------- |
| Client layers      | 9/10  | Clean separation, one pragmatic cross-import      |
| Server layers      | 9/10  | Textbook hexagonal, domain is pure Python         |
| State management   | 10/10 | Perfect Zustand/React Query split                 |
| TypeScript quality | 9/10  | Strict mode, zero `any`, good generics            |
| Python type safety | 9/10  | Full hints, modern `\|` union syntax, Pydantic    |
| Design system      | 8/10  | Mood colors hardcoded outside token system        |
| Performance        | 7/10  | ScrollView limitation, no FlashList               |
| Error handling     | 6/10  | No error boundaries, no global handler, no toasts |
| Testing            | 2/10  | Zero tests despite "test-heavy" mandate           |
| Dependencies       | 8/10  | Well-chosen, one unused (reanimated)              |
| API integration    | 6/10  | Mock data only, codegen pipeline ready but idle   |
| Monorepo tooling   | 9/10  | Lefthook + validation scripts + pnpm workspaces   |

---

## Client Architecture (React Native / Expo)

### Stack

- Expo SDK 54, React 19, React Native 0.81
- Expo Router 6 (file-based routing)
- NativeWind v4 + Tailwind CSS v3
- Zustand 5, React Query 5
- react-native-web for cross-platform

### Layer Alignment

```
app/                → Routing (thin re-exports only)          ✅
  ↓
src/features/       → Feature modules (screen + hooks + UI)   ✅
  ↓
src/store/          → Zustand stores (client state)           ✅
src/api/            → React Query (server state)              ✅
  ↓
src/lib/            → Shared types, utils, hooks              ✅
src/theme/          → Design tokens + theme sync              ✅
src/tw/             → NativeWind re-exports + cn()            ✅
```

**Verdict: EXCELLENT.** Every layer has a clear single responsibility. Route
files are 1–3 line re-exports. All logic lives in features.

### Feature Self-Containment

Three features exist, all with their own `AGENTS.md`:

| Feature    | Files | Self-Contained? | Notes                                 |
| ---------- | ----- | --------------- | ------------------------------------- |
| `home`     | 4     | Partial         | Imports hooks + components from pulse |
| `pulse`    | 12    | Yes             | Most complex feature, mock data       |
| `settings` | 2     | Yes             | Clean, uses store + lib only          |

**Cross-import: Home → Pulse.** `HomeScreen.tsx` imports `useTeamMembers`,
`MoodPicker`, `StatusDot`, `MoodDistribution`, `Avatar`, `getMoodColor`, and
`formatRelativeTime` from the pulse feature. This is documented in both
feature-level `AGENTS.md` files as a pragmatic choice. Not a violation — but
signals that `Avatar`, `StatusDot`, and `MoodBadge` may belong in `packages/ui`.

### State Management

| Store              | Type    | Persisted? | Purpose                  |
| ------------------ | ------- | ---------- | ------------------------ |
| `preferencesStore` | Zustand | Yes (AS)   | username, darkMode       |
| `appStore`         | Zustand | No         | isReady, hasOnboarded    |
| React Query        | RQ      | No         | Team members (mock data) |

**Verdict: CORRECT.** Zustand for client-only state, React Query for
async/server state. No state management misuse detected. Stores import from
`lib/utils/storage` only — never from features.

### TypeScript Quality

- **Strict mode**: Enabled, zero `any` usage
- **Generics**: `storage.ts` uses `getItem<T>()` / `setItem<T>()` properly
- **Type exports**: Barrel pattern via `types/index.ts`
- **React 19**: Using modern patterns in layout and hooks

### Design System

The design system is well-architected with three tiers:

1. **`tokens.ts`** — Brand constants, color scales (50–900), semantic mappings
2. **`global.css`** — CSS custom properties using `light-dark()` for dark mode
3. **`tw/index.tsx`** — NativeWind component re-exports + `cn()` merge utility

**Issue found:** Mood colors in `MoodDistribution.tsx` use a local
`getMoodColor()` function with hardcoded hex values (`#22c55e`, `#facc15`,
etc.) instead of referencing design tokens. This creates drift risk.

### Performance

| Pattern              | Status | Notes                                   |
| -------------------- | ------ | --------------------------------------- |
| FlatList for lists   | ❌     | Uses `ScrollView + .map()` (web compat) |
| Premature memo       | ✅     | No unnecessary memoization              |
| Inline styles in JSX | ✅     | Minimal — uses NativeWind classes       |
| Image optimization   | ✅     | No oversized assets                     |
| FlashList            | ❌     | Not installed (NativeWind web compat)   |

**Key limitation:** `ScrollView + .map()` is used instead of `FlatList` because
of NativeWind web compatibility issues. Documented in pulse `AGENTS.md` as a
known tradeoff. For mock data with 8 items this is fine; would need FlashList
for production-scale lists.

### Navigation

Expo Router 6 with file-based routing. Three routes:

| Route       | Screen         | File                  |
| ----------- | -------------- | --------------------- |
| `/`         | HomeScreen     | `app/index.tsx`       |
| `/pulse`    | PulseDashboard | `app/pulse/index.tsx` |
| `/settings` | SettingsScreen | `app/settings.tsx`    |

Root layout (`app/_layout.tsx`) handles: QueryClientProvider, store hydration,
theme sync, Stack navigator configuration, and header styling.

---

## Server Architecture (FastAPI / Python)

### Stack

- Python 3.11+, FastAPI 0.115+
- SQLAlchemy 2.x (Mapped[] style), SQLite
- Pydantic v2, pydantic-settings 2.0+
- Uvicorn

### Hexagonal Architecture

```
┌─────────────────────────────────────────────────┐
│  src/api/           HTTP Adapter (FastAPI)       │  Routes, schemas, DI
├─────────────────────────────────────────────────┤
│  src/application/   Use-Case Orchestration       │  Service layer
├─────────────────────────────────────────────────┤
│  src/domain/        Business Logic               │  Pure Python (verified)
├─────────────────────────────────────────────────┤
│  src/infrastructure/ DB Adapter (SQLAlchemy)     │  ORM models, repos, mappers
├─────────────────────────────────────────────────┤
│  src/config/        Settings                     │  Pydantic BaseSettings
└─────────────────────────────────────────────────┘
```

**Verdict: TEXTBOOK.** Clean 5-layer hexagonal architecture.

### Domain Purity — Verified

Domain layer (`src/domain/`) imports **only** standard library:

- `user_preferences.py`: `dataclasses`, `datetime`
- `validation.py`: `re`

Zero framework imports (FastAPI, SQLAlchemy, Pydantic). This is the gold
standard for domain purity.

### Repository Pattern

`PreferencesRepository` implements:

- Constructor injection of `Session`
- `get_by_user_id()` → domain entity via mapper
- `save()` → upsert with commit + refresh
- `delete()` → returns boolean
- Bidirectional mappers (`to_domain()` / `to_model()`) — fail-fast on drift

### Dependency Injection

Clean FastAPI `Depends()` chain:

```python
get_db()               → Session (generator with cleanup)
get_preferences_repo() → PreferencesRepository
get_preferences_service() → PreferencesService
```

Route handlers receive fully-wired services. No service locator anti-pattern.

### Type Safety

100% type hint coverage across all layers:

- Modern `|` union syntax (`UserPreferences | None`)
- All function signatures have return types
- Pydantic v2 `ConfigDict(from_attributes=True)` for serialization
- SQLAlchemy 2.x `Mapped[]` with `mapped_column()`

### Error Handling

| Layer          | Pattern                         | Status |
| -------------- | ------------------------------- | ------ |
| Domain         | Raises `ValueError`             | ✅     |
| Routes         | Catches `ValueError` → HTTP 400 | ✅     |
| Global handler | `@app.exception_handler()`      | ❌     |
| Logging        | `logging` module                | ❌     |

Domain validation errors bubble up correctly to HTTP responses. But there is
**no global exception handler** for unexpected errors — unhandled exceptions
will return raw 500s with stack traces.

### Configuration

`BaseSettings` with `.env` support, parsed CORS origins, sensible defaults.
`.env.example` exists with documentation. Solid.

---

## Monorepo Tooling

### Workspace Structure

```
pnpm-workspace.yaml
├── apps/client    (Expo / React Native)
├── apps/server    (FastAPI / Python)
├── packages/core  (OpenAPI codegen via orval)
└── packages/ui    (Shared UI components)
```

### Git Hooks (Lefthook)

- **commit-msg**: Validates conventional commit format
- **pre-push**: Validates branch naming

### Validation Scripts

- `.github/scripts/validate-commit-msg.sh` — enforces `type(scope): description`
- `.github/scripts/validate-branch-name.sh` — enforces `feat/STORY-NN-slug`
- `.github/scripts/sync-stories.sh` — syncs story specs to GitHub Issues + board

### OpenAPI Codegen

`packages/core` uses orval to generate React Query hooks + TypeScript types from
`openapi.json`. Pipeline is configured but currently idle (client uses mock data).

**Verdict: SOLID.** The monorepo tooling is mature — git hooks enforce
conventions, story sync automates project management, and the codegen pipeline
is ready for when the API connects.

---

## Critical Issues

### 1. Zero Test Coverage

**Severity: CRITICAL**

No test files exist in either client or server. CLAUDE.md mandates:

- _"Server is test-heavy — All FastAPI routes, domain validation, repositories, and services must have tests."_
- _"Test complex hooks, store logic, and domain use-cases."_

No test runner is configured. No pytest, no vitest, no jest.

### 2. No Database Migrations

**Severity: HIGH**

Server uses `create_tables()` at startup (schema-on-start). No Alembic setup.
Schema changes will require manual database recreation. Not viable for
production.

### 3. No Server Logging

**Severity: HIGH**

Zero `logging` imports or logger instances across the entire server. No audit
trail for debugging. Errors are caught but not logged.

### 4. No Error Boundaries (Client)

**Severity: HIGH**

No `ErrorBoundary` component anywhere. Unhandled errors in any feature will
crash the entire app to a white screen. CLAUDE.md requires: _"Wrap feature-level
screens with error boundaries."_

### 5. react-native-reanimated Installed But Unused

**Severity: LOW**

The babel plugin is configured, the package is installed, but zero reanimated
imports exist. Only `LayoutAnimation` (built-in RN API) is used. Either remove
the dependency or migrate animations to reanimated.

### 6. Mood Colors Outside Token System

**Severity: LOW**

`MoodDistribution.tsx` defines mood colors via a local `getMoodColor()` function
with hardcoded hex values, bypassing the design token system in `tokens.ts`.

### 7. ARCHITECTURE.md Folder Structure Stale

**Severity: LOW**

The folder structure section is missing:

- `features/pulse/` (entire feature)
- `store/appStore.ts`
- `app/pulse/index.tsx` route

---

## Dependency Audit

### Client — Notable Dependencies

| Package                 | Version  | Status     | Notes                          |
| ----------------------- | -------- | ---------- | ------------------------------ |
| expo                    | ~54.0.33 | ✅ Current | Latest SDK                     |
| react                   | 19.1.0   | ✅ Current | React 19                       |
| react-native            | 0.81.5   | ✅ Current | Latest stable                  |
| zustand                 | ^5.0.0   | ✅ Current | v5 with React 19 support       |
| @tanstack/react-query   | ^5.90.21 | ✅ Current | Latest v5                      |
| nativewind              | ^4.2.2   | ✅ OK      | Docs say v5 (minor inaccuracy) |
| react-native-reanimated | ~4.1.1   | ⚠️ Unused  | Installed but not imported     |
| react-native-web        | ^0.21.2  | ✅ Current | Cross-platform support         |

### Server — Dependencies

| Package           | Version | Status     | Notes                    |
| ----------------- | ------- | ---------- | ------------------------ |
| fastapi           | >=0.115 | ✅ Current | Latest                   |
| sqlalchemy        | >=2.0   | ✅ Current | Modern Mapped[] style    |
| pydantic-settings | >=2.0   | ✅ Current | v2 with ConfigDict       |
| uvicorn           | >=0.32  | ✅ Current | Standard extras included |

**Missing dev dependencies** in server: pytest, ruff/black, mypy.

---

## Architecture Compliance Checklist

| Rule (from CLAUDE.md)         | Compliant? | Evidence                             |
| ----------------------------- | ---------- | ------------------------------------ |
| Features are self-contained   | ⚠️ Partial | Home→Pulse cross-import (documented) |
| Stores use lib/ only          | ✅         | preferencesStore imports storage.ts  |
| No direct AsyncStorage in UI  | ✅         | Components use store actions         |
| Packages are leaf nodes       | ✅         | packages/_ never import from apps/_  |
| React Query for server state  | ✅         | useTeamMembers uses useQuery         |
| Zustand for client-only state | ✅         | preferences, app state               |
| No Zustand for server data    | ✅         | No server data in stores             |
| Error boundaries on features  | ❌         | None exist                           |
| TDD for business logic        | ❌         | Zero tests                           |
| Server test-heavy             | ❌         | Zero tests                           |
| FlatList over ScrollView      | ❌         | ScrollView used (web compat reason)  |
| No hardcoded hex values       | ⚠️ Partial | Mood colors hardcoded                |
| Domain is pure Python         | ✅         | Verified — zero framework imports    |
