Last updated: 2026-02-26

> This file is the **entry point** for any AI agent working in this repository.
> Read this first. Then navigate to the relevant app or package for deeper context.

## Repository Overview

**agentic-rn-demo** is a pnpm monorepo containing a cross-platform Expo app
(iOS, Android, Web), a FastAPI backend, and shared packages. It demonstrates
architecture-first development with AI-assisted workflows.

## Structure

```
agentic-rn-demo/
├── apps/client/       → Expo app — iOS, Android, Web (has its own AGENTS.md)
├── apps/server/       → FastAPI backend — Python, hexagonal architecture (has its own AGENTS.md)
├── packages/ui/       → Shared UI components
├── packages/core/     → Shared types, generated API client + hooks (has its own AGENTS.md)
└── docs/              → Architecture docs, workflow guides, story specs
```

## Boundary Rules

1. **API types are generated** — `packages/core` generates TS types + React Query hooks from the OpenAPI spec. Never hand-write API types.
2. **Features are self-contained** — each feature folder owns its screen, hooks, and components.
3. **Packages are leaf nodes** — `packages/*` never import from `apps/*`.
4. **No direct AsyncStorage in UI** — components use store actions, stores use `lib/utils/storage`.

## Navigation for Agents

| I need to...                      | Go to                                         |
| --------------------------------- | --------------------------------------------- |
| Understand the architecture       | `docs/ARCHITECTURE.md`                        |
| Understand the workflow           | `docs/WORKFLOW.md`                            |
| See the database schema           | `docs/ARCHITECTURE.md` → Database Schema      |
| Work on the client app            | `apps/client/AGENTS.md`                       |
| Work on the server API            | `apps/server/AGENTS.md`                       |
| Work on shared types / API client | `packages/core/AGENTS.md`                     |
| See a feature-level example       | `apps/client/src/features/settings/AGENTS.md` |
| Find a story spec                 | `docs/STORIES/STORY-*.md`                     |

## Commit Conventions

Format: `type(scope): description`

- **type**: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`
- **scope**: `client`, `server`, `ui`, `core`, `mono`, or feature name
- **description**: imperative mood, lowercase, max 72 chars

Examples:

```
feat(client): add dark mode toggle to settings
fix(core): handle null in Result type
docs(mono): update ARCHITECTURE.md with data flow
```

## Quality Bar

- TypeScript strict mode everywhere
- No `any` types — use `unknown` and narrow
- Format with Prettier before committing
- Every new feature needs a story spec in `docs/STORIES/`

## Git Hooks (Lefthook)

[Lefthook](https://github.com/evilmartians/lefthook) enforces conventions at
the git level. Hooks run automatically — both humans and AI agents must pass
the same gates.

| Hook         | What it checks                                                              |
| ------------ | --------------------------------------------------------------------------- | ---------- |
| `commit-msg` | Message format: `type(scope): description`, max 72 chars, no AI attribution |
| `pre-commit` | `pnpm lint`, `pnpm typecheck`, `pnpm format --check` (parallel)             |
| `pre-push`   | Branch name matches `type/STORY-NN-slug` or `chore                          | docs/slug` |

Validation scripts live in `.github/scripts/`. Config is in `lefthook.yml`.

**Never use `--no-verify`** to bypass hooks. If a hook fails, fix the
underlying issue.

## Database Schema Documentation

`docs/ARCHITECTURE.md` contains a **Database Schema** section with an ER diagram
showing all tables, columns, types, and relationships. The database is currently
SQLite (swappable to PostgreSQL via `DATABASE_URL`).

**Rule — schema updates**: After any migration that adds, removes, or modifies
tables, columns, or relationships, you **must** update the database ER diagram
in `docs/ARCHITECTURE.md` in the same PR. The diagram must always reflect the
current state of the database after migration.

## If You Are Unsure

- Read the relevant AGENTS.md one level deeper
- Check `docs/ARCHITECTURE.md` for boundary rules
- When in doubt, ask — don't guess at conventions
