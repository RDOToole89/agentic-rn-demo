# CLAUDE.md — Claude Code Configuration

> This file is read automatically by Claude Code at session start.
> For agent-agnostic architecture docs, see the `AGENTS.md` chain.

## Context Chain

Read these before making changes — they are the architecture prompt:

1. `AGENTS.md` — repo overview, boundaries, commit conventions
2. `apps/client/AGENTS.md` — app layers, decision tree, naming
3. `apps/client/src/features/*/AGENTS.md` — feature-specific context
4. `.context/` — session continuity, handoff notes, temporary agent files

## Commit Conventions

Format: `type(scope): description`

| Part      | Values                                              |
|-----------|-----------------------------------------------------|
| **type**  | `feat`, `fix`, `refactor`, `docs`, `test`, `chore`  |
| **scope** | `client`, `ui`, `core`, `mono`, or feature name     |

- Imperative mood, lowercase, max 72 chars
- One logical change per commit

## Workflow

1. Every feature starts with a story spec in `docs/STORIES/`
2. Sync to GitHub Issues: `.github/scripts/sync-stories.sh`
3. Read the AGENTS.md chain before implementing
4. Self-review against the PR checklist in `docs/WORKFLOW.md`

## Architectural Boundaries

- **Domain is pure** — `src/domain/` has zero framework imports
- **Services are interfaces** — never import AsyncStorage directly from UI
- **Features are self-contained** — each feature owns its screen, hooks, components
- **Packages are leaf nodes** — `packages/*` never import from `apps/*`

## Code Style

- TypeScript strict mode — no `any`, use `unknown` and narrow
- React 19 patterns: `use()` not `useContext()`, `<Context value={}>` not `<Context.Provider>`
- Zustand stores are thin wrappers that delegate to domain use-cases
- Format with Prettier before committing

## Project Commands

| Command          | What it does                |
|------------------|-----------------------------|
| `pnpm dev`       | Start Expo dev server       |
| `pnpm lint`      | Lint all packages           |
| `pnpm format`    | Format with Prettier        |
| `pnpm typecheck` | TypeScript check all        |

## Platform Support

This app targets **iOS, Android, and Web** from a single codebase.
Use `react-native-web` compatible APIs. Test on web (`pnpm -C apps/client web`)
when making UI changes.

## Documentation Hygiene

Documentation rot is a first-class concern. After completing a story, feature,
or long session, always ask whether any of the following need updating:

- **`.context/`** — update handoff notes, session state, "What's Done" list
- **AGENTS.md** (any level) — new features may need navigation table entries,
  boundary rule updates, or new feature-level AGENTS.md files
- **docs/ADR/** — if a technical decision was made, write an ADR
- **docs/ARCHITECTURE.md** — structural changes (new layers, packages, diagrams)
- **docs/STORIES/** — mark story status as `done`, verify acceptance criteria
- **docs/guides/DEVELOPER-GUIDE.md** — new commands, setup steps, troubleshooting

**Rule**: If you changed the code, check if the docs still match. Ask the user
before the session ends: *"Should I update any documentation to reflect what
we changed?"*

## Temporary Agent Files

Use `.context/` for session handoff notes, scratchpads, and temporary agent
files. This directory is gitignored — it is local-only and never committed.
Do not store permanent documentation here; use `docs/` for that.
