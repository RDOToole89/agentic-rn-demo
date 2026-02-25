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
- **Never** add "Co-Authored-By: Claude", "Powered by Claude", or any AI
  attribution to commits or PRs

## Workflow

1. Every feature starts with a story spec in `docs/STORIES/`
2. Sync to GitHub Issues: `.github/scripts/sync-stories.sh`
3. Read the AGENTS.md chain before implementing
4. Self-review against the PR checklist in `docs/WORKFLOW.md`

## Branching & Worktrees

**All feature work happens on feature branches** — never commit directly to
`main`. Branch format: `feat/STORY-{NN}-{slug}` (e.g. `feat/STORY-06-animations`).

When starting a feature implementation, **always ask the user**:
*"Do you want me to work in a git worktree, or on a feature branch in the
current working tree?"*

- **Worktree** — isolated directory, doesn't touch current branch. Use when the
  user is actively working on something else.
- **Feature branch** — standard `git switch -c`. Use when the user isn't doing
  other work in parallel.

## Story Lifecycle Management

Project board: <https://github.com/users/RDOToole89/projects/5>

When picking up a story from the project board, manage the full lifecycle:

1. **Pick up** — Move the issue to **In Progress** on the project board
2. **Number check** — Look at `docs/STORIES/` to find the highest existing
   `STORY-NN` number. The new story **must** use the next sequential number
   (e.g., if `STORY-03` exists, the next is `STORY-04`). Never skip or reuse numbers.
3. **Ask worktree or branch** — see "Branching & Worktrees" above
4. **Branch** — Create a feature branch: `feat/STORY-{NN}-{slug}`
5. **Read the spec** — Read the story in `docs/STORIES/` and the linked issue
6. **Implement** — Follow the AGENTS.md chain and commit conventions
7. **PR** — Open a PR against `main`, link the issue (`Closes #N`)
8. **Done** — Once the PR is merged, move the issue to **Done** on the board

Use `gh` CLI for all board operations:
- Move to In Progress: `gh project item-edit --project-id <id> --id <item-id> --field-id <status-field-id> --single-select-option-id <in-progress-id>`
- Move to Done: same command with the Done option ID
- Create branch: `gh issue develop <issue-number> --name feat/STORY-NN-slug`

## Architectural Boundaries

- **Features are self-contained** — each feature owns its screen, hooks, components
- **Stores use lib/ only** — `src/store/` imports from `src/lib/`, never from features
- **No direct AsyncStorage in UI** — components use store actions, stores use `lib/utils/storage`
- **Packages are leaf nodes** — `packages/*` never import from `apps/*`

## State Management

- **React Query** (`@tanstack/react-query`) for all server/async state — API
  calls, caching, refetching, optimistic updates
- **Zustand** for client-only app state — theme, UI preferences, local settings
- Never use Zustand for data that comes from a server; never use React Query
  for purely local state

## Code Style

- TypeScript strict mode — no `any`, use `unknown` and narrow
- React 19 patterns: `use()` not `useContext()`, `<Context value={}>` not `<Context.Provider>`
- Zustand stores call `lib/utils/` directly for persistence
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
- **docs/ADR/** — if a technical decision was made, write an ADR (see rule below)
- **docs/ARCHITECTURE.md** — structural changes (new layers, packages, diagrams)
- **docs/STORIES/** — mark story status as `done`, verify acceptance criteria
- **docs/guides/DEVELOPER-GUIDE.md** — new commands, setup steps, troubleshooting

**Rule — ADRs**: After implementing a major feature, new design pattern, or
architectural change, ask the user: *"Should I write an ADR for this decision?"*
ADRs live in `docs/ADR/ADR-{NNN}-{slug}.md` and must be added to the ADR
`README.md` index.

**Rule — proximity updates**: When you edit code, you **must** also update the
nearest `AGENTS.md` and any `README.md` in the same directory or parent
directory. New features need a new feature-level `AGENTS.md`. Changed structure
means the parent `AGENTS.md` navigation tables and file lists must match.

**Rule — session end**: If you changed the code, check if the docs still match.
Ask the user before the session ends: *"Should I update any documentation to
reflect what we changed?"*

## Temporary Agent Files

Use `.context/` for session handoff notes, scratchpads, and temporary agent
files. This directory is gitignored — it is local-only and never committed.
Do not store permanent documentation here; use `docs/` for that.
