# Improvement Roadmap

Last updated: 2026-02-26

> Prioritized action items from the architecture and documentation audit.
> Each item links to the audit that identified it and specifies exactly what
> to change.

---

## Priority Legend

| Level | Meaning            | Timeline        |
| ----- | ------------------ | --------------- |
| P0    | Critical — do now  | This week       |
| P1    | High — next sprint | Next 1–2 weeks  |
| P2    | Medium — backlog   | When convenient |
| P3    | Nice to have       | Opportunistic   |

---

## P0 — Critical

### 1. Add test infrastructure

**Source:** [ARCHITECTURE-AUDIT.md](./ARCHITECTURE-AUDIT.md) — Testing: 2/10

The biggest gap in the codebase. CLAUDE.md mandates "test-heavy" server coverage
and client tests for hooks/stores, but zero tests exist anywhere.

**Server (pytest):**

```bash
# pyproject.toml — add dev dependencies
[project.optional-dependencies]
dev = ["pytest", "httpx", "pytest-cov"]
```

- Add `tests/conftest.py` with in-memory SQLite fixture
- Add `tests/domain/test_validation.py` — test `validate_username()`, `validate_user_id()`
- Add `tests/infrastructure/test_preferences_repo.py` — CRUD operations
- Add `tests/application/test_preferences_service.py` — service orchestration
- Add `tests/api/test_preferences_routes.py` — FastAPI TestClient

**Client (vitest or jest):**

- Install vitest + @testing-library/react-native
- Add `src/store/__tests__/preferencesStore.test.ts`
- Add `src/features/settings/hooks/__tests__/useSettings.test.ts`
- Add `src/lib/utils/__tests__/storage.test.ts`
- Add `src/features/pulse/utils/__tests__/formatTime.test.ts`

---

### 2. Add error boundaries to client

**Source:** [ARCHITECTURE-AUDIT.md](./ARCHITECTURE-AUDIT.md) — Error handling: 6/10

No error boundaries exist. Unhandled errors crash the entire app to a white
screen.

**Changes:**

- Create `packages/ui/src/ErrorBoundary.tsx` (reusable class component)
- Wrap each feature screen in `app/_layout.tsx` or create per-feature wrappers
- Add a fallback UI component showing "Something went wrong" with a retry button
- Consider Expo Router's built-in error boundary support (`+error.tsx` files)

---

### 3. Fix stale ARCHITECTURE.md folder structure

**Source:** [AI-AGENTS-STRATEGY-AUDIT.md](./AI-AGENTS-STRATEGY-AUDIT.md) — Issue #9

The folder structure section in `docs/ARCHITECTURE.md` is missing:

- `features/pulse/` directory (entire feature with 12+ files)
- `store/appStore.ts`
- `app/pulse/index.tsx` route

**File:** `docs/ARCHITECTURE.md` lines 218–278

---

## P1 — High

### 4. Add Alembic migrations for server

**Source:** [ARCHITECTURE-AUDIT.md](./ARCHITECTURE-AUDIT.md) — Critical Issue #2

Server uses `create_tables()` at startup. No schema versioning, no rollback
capability.

**Changes:**

- `cd apps/server && alembic init migrations`
- Configure `alembic.ini` to use `settings.database_url`
- Generate initial migration from current models
- Replace `create_tables()` in `main.py` lifespan with Alembic upgrade
- Add `alembic` to dependencies in `pyproject.toml`

---

### 5. Add structured logging to server

**Source:** [ARCHITECTURE-AUDIT.md](./ARCHITECTURE-AUDIT.md) — Critical Issue #3

Zero logging across the entire server. No audit trail for debugging.

**Changes:**

- Add logging config in `src/config/logging.py`
- Use `logging.getLogger(__name__)` in services and routes
- Log validation errors at WARNING level
- Log unhandled exceptions at ERROR level
- Consider `structlog` for JSON-formatted logs

---

### 6. Move mood colors to design token system

**Source:** [ARCHITECTURE-AUDIT.md](./ARCHITECTURE-AUDIT.md) — Design system: 8/10

`MoodDistribution.tsx` has hardcoded hex values in `getMoodColor()` function
instead of using design tokens.

**Changes:**

- Add mood color scale to `src/theme/tokens.ts`
- Add CSS variables to `src/global.css`
- Update `getMoodColor()` to reference tokens instead of hex literals
- Update `MoodBadge.tsx` and `MoodPicker.tsx` if they also hardcode colors

---

### 7. Resolve react-native-reanimated status

**Source:** [ARCHITECTURE-AUDIT.md](./ARCHITECTURE-AUDIT.md) — Critical Issue #5

Package is installed, babel plugin is configured, but zero imports exist. Only
`LayoutAnimation` is used.

**Options:**

- **Option A — Remove:** Uninstall `react-native-reanimated`, remove babel
  plugin. Keeps bundle smaller.
- **Option B — Keep:** Leave installed for future animation work. Document the
  decision in pulse `AGENTS.md`.

**Recommendation:** Keep if animations are planned for upcoming stories. Remove
if not. Ask the user.

---

### 8. Add `Last updated` dates to undated AGENTS.md files

**Source:** [AI-AGENTS-STRATEGY-AUDIT.md](./AI-AGENTS-STRATEGY-AUDIT.md) — Date currency: 5/10

9 of 14 AGENTS.md files are missing dates. CLAUDE.md mandates this.

**Files to update:**

- `/AGENTS.md`
- `/CLAUDE.md`
- `apps/client/src/store/AGENTS.md`
- `apps/server/AGENTS.md`
- `apps/server/src/api/AGENTS.md`
- `apps/server/src/application/AGENTS.md`
- `apps/server/src/config/AGENTS.md`
- `apps/server/src/domain/AGENTS.md`
- `apps/server/src/infrastructure/AGENTS.md`
- `packages/core/AGENTS.md`

Add `Last updated: YYYY-MM-DD` as line 3 of each file.

---

### 9. Fix commit convention duplication

**Source:** [AI-AGENTS-STRATEGY-AUDIT.md](./AI-AGENTS-STRATEGY-AUDIT.md) — Single source of truth: 6/10

Commit conventions are duplicated in CLAUDE.md and root AGENTS.md with a
divergence: CLAUDE.md is missing `server` as a scope.

**Options:**

- **Option A (preferred):** Remove the scope table from CLAUDE.md, add a
  reference: _"See root AGENTS.md for commit format and scopes."_ Keep the
  Claude-specific rules (no AI attribution, ask before committing).
- **Option B:** Keep both but add `server` to CLAUDE.md and ensure they stay
  in sync.

---

### 10. Add `packages/ui` to root AGENTS.md navigation

**Source:** [AI-AGENTS-STRATEGY-AUDIT.md](./AI-AGENTS-STRATEGY-AUDIT.md) — Navigation: 7/10

`packages/ui` exists but is not listed in the root navigation table.

**File:** `/AGENTS.md` — add row to navigation table:

```
| Work on shared UI components | `packages/ui/AGENTS.md` |
```

Also create `packages/ui/AGENTS.md` if it doesn't exist.

---

## P2 — Medium

### 11. Add README.md files to apps and packages

**Source:** [AI-AGENTS-STRATEGY-AUDIT.md](./AI-AGENTS-STRATEGY-AUDIT.md) — Issue #7

CLAUDE.md says _"Humans need README.md"_ but none exist at workspace level.

**Files to create:**

- `apps/client/README.md` — setup, dev commands, architecture overview with
  Mermaid diagram
- `apps/server/README.md` — setup, env config, API docs link, layer diagram
- `packages/core/README.md` — codegen pipeline, how to regenerate
- `packages/ui/README.md` — component inventory, usage examples

Each should link to its `AGENTS.md` for detailed architecture context.

---

### 12. Add global exception handler to FastAPI

**Source:** [ARCHITECTURE-AUDIT.md](./ARCHITECTURE-AUDIT.md) — Error handling: 6/10

Replace per-route try/catch with a global handler.

**Changes in `apps/server/src/api/main.py`:**

```python
@app.exception_handler(ValueError)
async def value_error_handler(request, exc):
    return JSONResponse(status_code=400, content={"detail": str(exc)})

@app.exception_handler(Exception)
async def generic_error_handler(request, exc):
    logger.exception("Unhandled error")
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})
```

Then remove try/catch blocks from individual route handlers.

---

### 13. Make server routes async

**Source:** [ARCHITECTURE-AUDIT.md](./ARCHITECTURE-AUDIT.md)

All routes use `def` (sync). FastAPI runs these in a thread pool, which works
but is suboptimal.

**Changes:**

- Change `def get_preferences` → `async def get_preferences`
- Change `def update_preferences` → `async def update_preferences`
- Consider async SQLAlchemy session if I/O becomes a bottleneck

**Note:** Low priority — sync routes are fine for current workload.

---

### 14. Add toast/notification library to client

**Source:** [ARCHITECTURE-AUDIT.md](./ARCHITECTURE-AUDIT.md) — Error handling: 6/10

No mechanism for showing user-facing error messages or success notifications.

**Options:**

- `burnt` — Native iOS/Android toasts (lightweight)
- `react-native-toast-message` — Cross-platform, customizable
- `sonner-native` — Port of the Sonner toast library

**Requirement:** Must support iOS, Android, and Web.

---

### 15. Formalize `.context/` handoff rules in CLAUDE.md

**Source:** [AI-AGENTS-STRATEGY-AUDIT.md](./AI-AGENTS-STRATEGY-AUDIT.md) — Handoff: 7/10

`.context/CONTEXT-HANDOFF.md` exists but there are no rules for when/how to
update it.

**Add to CLAUDE.md:**

```markdown
## Session Handoff

After completing a feature or ending a long session, update
`.context/CONTEXT-HANDOFF.md` with:

- What was completed
- What's in progress
- Any decisions made
- Blockers or open questions
```

---

### 16. Consider moving shared pulse components to `packages/ui`

**Source:** [ARCHITECTURE-AUDIT.md](./ARCHITECTURE-AUDIT.md) — Feature self-containment

Components imported by Home from Pulse (`Avatar`, `StatusDot`, `MoodBadge`,
`MoodDistribution`) are general-purpose UI. If a 3rd feature needs them,
they should move to `packages/ui`.

**Trigger:** When any feature beyond Home imports these components.

---

## P3 — Nice to Have

### 17. Add FlashList for long lists

**Source:** [ARCHITECTURE-AUDIT.md](./ARCHITECTURE-AUDIT.md) — Performance: 7/10

Currently using `ScrollView + .map()` due to NativeWind web compatibility.
Monitor NativeWind/FlashList web support and switch when viable.

**Package:** `@shopify/flash-list`

---

### 18. Add E2E tests

**Source:** [ARCHITECTURE-AUDIT.md](./ARCHITECTURE-AUDIT.md) — Testing: 2/10

After unit/integration tests are in place, add E2E testing.

**Options:**

- Maestro — YAML-based, good for mobile
- Detox — JS-based, Wix-maintained
- Playwright — if web-first testing is sufficient

---

### 19. Add API integration tests for server

**Source:** [ARCHITECTURE-AUDIT.md](./ARCHITECTURE-AUDIT.md) — Testing: 2/10

Use FastAPI `TestClient` with in-memory SQLite for full request/response
testing without a running server.

```python
from fastapi.testclient import TestClient
client = TestClient(app)
response = client.get("/api/v1/preferences/user-1")
assert response.status_code == 200
```

---

### 20. Set up CI/CD pipeline

**Source:** [ARCHITECTURE-AUDIT.md](./ARCHITECTURE-AUDIT.md) — Monorepo tooling: 9/10

Git hooks enforce conventions locally. Add GitHub Actions for:

- Lint + typecheck on PR
- Test suite on PR
- Build verification on PR
- Auto-deploy on merge to main (when ready)

---

## Progress Tracker

Use this table to track completion. Update status as items are addressed.

| #   | Item                                 | Priority | Status  |
| --- | ------------------------------------ | -------- | ------- |
| 1   | Add test infrastructure              | P0       | Pending |
| 2   | Add error boundaries                 | P0       | Pending |
| 3   | Fix ARCHITECTURE.md folder structure | P0       | Pending |
| 4   | Add Alembic migrations               | P1       | Pending |
| 5   | Add structured logging               | P1       | Pending |
| 6   | Move mood colors to tokens           | P1       | Pending |
| 7   | Resolve reanimated status            | P1       | Pending |
| 8   | Add dates to AGENTS.md files         | P1       | Pending |
| 9   | Fix commit convention duplication    | P1       | Pending |
| 10  | Add packages/ui to nav table         | P1       | Pending |
| 11  | Add README.md files                  | P2       | Pending |
| 12  | Add global exception handler         | P2       | Pending |
| 13  | Make server routes async             | P2       | Pending |
| 14  | Add toast library                    | P2       | Pending |
| 15  | Formalize handoff rules              | P2       | Pending |
| 16  | Move shared pulse components         | P2       | Pending |
| 17  | Add FlashList                        | P3       | Pending |
| 18  | Add E2E tests                        | P3       | Pending |
| 19  | Add API integration tests            | P3       | Pending |
| 20  | Set up CI/CD pipeline                | P3       | Pending |
