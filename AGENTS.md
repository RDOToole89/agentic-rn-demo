# AGENTS.md — Root (Monorepo)

> This file is the **entry point** for any AI agent working in this repository.
> Read this first. Then navigate to the relevant app or package for deeper context.

## Repository Overview

**agentic-rn-demo** is a pnpm monorepo containing a cross-platform Expo app
(iOS, Android, Web) and shared packages. It demonstrates architecture-first
development with AI-assisted workflows.

## Structure

```
agentic-rn-demo/
├── apps/client/       → Expo app — iOS, Android, Web (has its own AGENTS.md)
├── packages/ui/       → Shared UI components
├── packages/core/     → Shared types and utilities
└── docs/              → Architecture docs, workflow guides, story specs
```

## Boundary Rules

1. **Domain is pure** — `src/domain/` has zero framework imports. No React, no AsyncStorage, no Expo.
2. **Services are interfaces** — UI and domain depend on `IStorageService`, never on `AsyncStorage` directly.
3. **Features are self-contained** — Each feature folder owns its screen, hooks, and components.
4. **Packages are leaf nodes** — `packages/*` never import from `apps/*`.

## Navigation for Agents

| I need to...                       | Go to                                        |
|------------------------------------|----------------------------------------------|
| Understand the architecture        | `docs/ARCHITECTURE.md`                       |
| Understand the workflow            | `docs/WORKFLOW.md`                           |
| Work on the client app             | `apps/client/AGENTS.md`                      |
| See a feature-level example        | `apps/client/src/features/settings/AGENTS.md`|
| Find a story spec                  | `docs/STORIES/STORY-*.md`                    |

## Commit Conventions

Format: `type(scope): description`

- **type**: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`
- **scope**: `client`, `ui`, `core`, `mono`, or feature name
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

## If You Are Unsure

- Read the relevant AGENTS.md one level deeper
- Check `docs/ARCHITECTURE.md` for boundary rules
- When in doubt, ask — don't guess at conventions
