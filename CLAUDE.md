# CLAUDE.md — Claude Code Configuration

> This file is read automatically by Claude Code at session start.
> For agent-agnostic architecture docs, see the `AGENTS.md` chain.

## Context Chain

Read these before making changes — they are the architecture prompt:

1. `AGENTS.md` — repo overview, boundaries, commit conventions
2. `apps/client/AGENTS.md` — app layers, decision tree, naming
3. `apps/client/src/features/*/AGENTS.md` — feature-specific context
4. `.context/` — session continuity, handoff notes, temporary agent files

## Progressive Disclosure (AGENTS.md Hierarchy)

This repo uses a **3-level AGENTS.md system** — each level adds detail without
repeating the level above. Agents should read top-down, stopping when they have
enough context for the task at hand.

| Level           | File                                             | What it covers                                               |
| --------------- | ------------------------------------------------ | ------------------------------------------------------------ |
| **Root**        | `AGENTS.md`                                      | Repo overview, workspace map, boundaries, commit conventions |
| **App/Package** | `apps/client/AGENTS.md`, `apps/server/AGENTS.md` | Stack, folder responsibilities, decision tree, naming        |
| **Feature**     | `src/features/*/AGENTS.md`                       | Feature-specific context, data flow, key files, gotchas      |

**Rules:**

- Every app and package must have an `AGENTS.md`
- Every non-trivial feature folder must have an `AGENTS.md`
- Parent `AGENTS.md` must have a navigation table linking to children
- Never duplicate content across levels — reference the parent instead
- When creating a new feature, create its `AGENTS.md` as part of the work

## Commit Conventions

Format: `type(scope): description`

| Part      | Values                                             |
| --------- | -------------------------------------------------- |
| **type**  | `feat`, `fix`, `refactor`, `docs`, `test`, `chore` |
| **scope** | `client`, `ui`, `core`, `mono`, or feature name    |

- Imperative mood, lowercase, max 72 chars
- One logical change per commit
- **Always ask before committing** — Never auto-commit. Ask the user before
  running `git commit` so they can review what's being committed.
- **Never** add "Co-Authored-By: Claude", "Powered by Claude", or any AI
  attribution to commits or PRs

## Workflow

1. Every feature starts with a story spec in `docs/STORIES/`
2. Sync to GitHub Issues: `.github/scripts/sync-stories.sh`
3. Read the AGENTS.md chain before implementing
4. Self-review against the PR checklist in `docs/WORKFLOW.md`

**Rule — plan to story**: When a plan is discussed and accepted by the user,
write it as a story spec in `docs/STORIES/STORY-{NN}-{slug}.md` and sync it
to the GitHub board before starting implementation.

## Branching & Worktrees

**All feature work happens on feature branches** — never commit directly to
`main`. Branch format: `feat/STORY-{NN}-{slug}` (e.g. `feat/STORY-06-animations`).

When starting a feature implementation, **always ask the user**:
_"Do you want me to work in a git worktree, or on a feature branch in the
current working tree?"_

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
7. **Docs check** — Before opening the PR, verify: are any `AGENTS.md` or
   `README.md` files stale from the changes you just made? Update them now,
   not later.
8. **PR** — Open a PR against `main`, link the issue (`Closes #N`)
9. **Move to In Review** — Move the issue to **In Review** on the project board
10. **Self-review** — Review your own PR: walk through the diff, check for
    missed acceptance criteria, lint issues, architectural violations, and
    documentation gaps. Post a summary comment on the PR with findings.
11. **Request human review** — Report back to the user with a summary of
    what was implemented and the self-review results. Ask: _"Ready for your
    review — shall I walk you through the changes, or do you want to review
    the PR directly?"_
12. **Merge** — Only after the user explicitly approves, merge the PR and
    move the issue to **Done** on the board

Use `gh` CLI for all board operations. Project field IDs:

- **Status field**: `PVTSSF_lAHOA7i1A84BO8Oqzg9fuec`
- **Options**: Backlog `f75ad846` | Ready `61e4505c` | In progress `47fc9ee4` | In review `df73e18b` | Done `98236657`

```bash
# Move an item to a status column
gh project item-edit --project-id <item-id> --field-id PVTSSF_lAHOA7i1A84BO8Oqzg9fuec --single-select-option-id <option-id>
```

**Story cleanup**: Running `sync-stories.sh` also archives completed stories.
If an issue is in the **Done** column on the board, its story file moves from
`docs/STORIES/` to `docs/STORIES/.archive/`. The issue stays on the board.

## Testing

- **TDD for business logic** — Write tests first for domain logic, services,
  and backend endpoints. Red → Green → Refactor.
- **Server is test-heavy** — All FastAPI routes, domain validation, repositories,
  and services must have tests. No merging server code without test coverage.
- **Client tests** — Test complex hooks, store logic, and domain use-cases.
  Pure UI screens don't need unit tests unless they contain logic.
- **Keep tests updated** — When you change code, update the corresponding tests.
  Stale tests are worse than no tests.
- **Run tests after changes** — Always run the test suite after bug fixes or
  refactors to catch regressions before committing.

## Code Hygiene

- **Delete dead code** — When a new feature supersedes old code, delete the old
  code. Don't comment it out, don't keep it "just in case". Git has history.
- **Delete stale tests** — Tests for removed code must be removed too. Stale
  tests that test nothing are noise and slow down the suite.
- **No backward compatibility by default** — Don't add shims, re-exports,
  deprecated wrappers, or renamed `_unused` variables. If something is replaced,
  remove it cleanly. If in doubt, ask the user: _"Do we need backward
  compatibility here, or can I remove the old code?"_ (usually not).
- **No dead imports or unused variables** — Clean up as you go. Linters catch
  these, but don't wait for the linter.
- **Flag unused packages** — If you notice a dependency in `package.json` or
  `pyproject.toml` that's no longer imported anywhere, flag it to the user:
  _"I noticed `X` isn't used anymore — should I remove it?"_ Don't uninstall
  without asking.

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

## UI & Design System

- **Stateless components by default** — UI components receive data via props,
  not internal state. Keep logic in hooks and screens, keep components pure.
- **`packages/ui` is the shared library** — All reusable UI primitives live in
  `packages/ui`, styled with NativeWind and driven by design tokens.
- **Atomic design (pragmatic)** — Build small, composable pieces (atoms →
  molecules → organisms) but don't over-abstract. If a component is only used
  once, it can live in the feature folder until reuse is needed.
- **Reuse over recreation** — Before building a new component, check
  `packages/ui` for an existing one. Extend or compose existing primitives
  rather than creating parallel versions.
- **Design tokens are the single source of truth** — Colors, spacing, radii,
  typography, and shadows come from `src/theme/tokens.ts` and flow through
  `tailwind.config.ts`. Never hardcode hex values or magic numbers in components.
- **Prevent design drift** — All UI must use the design system classes. If a
  screen needs a one-off style, it's a signal that a token or component is
  missing — add it to the system, don't hack around it.

## Dependencies & Libraries

- **Ask before building complex components** — Before implementing a non-trivial
  component (date picker, chart, gesture handler, rich text editor, etc.), ask
  the user: _"Should we use a library for this? I found X and Y — which do you
  prefer, or should I build it from scratch?"_
- **Cross-platform required** — Only use libraries that support **iOS, Android,
  and Web**. If a library doesn't support all three, find an alternative or
  discuss the tradeoff with the user.
- **Well-maintained only** — Prefer libraries that are actively maintained, have
  good TypeScript support, and are compatible with Expo SDK 54 / React Native 0.81.
- **Research with Context7** — When unsure about a library's API, usage patterns,
  or compatibility, use the Context7 MCP tool (`resolve-library-id` → `query-docs`)
  to look up current documentation before writing code.

## Code Style

- TypeScript strict mode — no `any`, use `unknown` and narrow
- React 19 patterns: `use()` not `useContext()`, `<Context value={}>` not `<Context.Provider>`
- Zustand stores call `lib/utils/` directly for persistence
- Format with Prettier before committing
- **Modern JS/TS** — use `const`/`let` (never `var`), optional chaining (`?.`),
  nullish coalescing (`??`), destructuring, template literals, `async`/`await`
  over `.then()` chains, arrow functions for callbacks
- **Python with type hints** — All server code uses type annotations (`def foo(x: str) -> int`),
  Pydantic models for validation, `dataclass` or `BaseModel` for entities.
  Target Python 3.12+ features (type statement, `|` union syntax, f-strings)
- **Self-documenting code** — Names should make comments unnecessary. The code
  should read like prose. Examples:

  ```
  // Bad
  const d = users.filter(u => u.s === 'a');
  const handleClick = () => { ... }

  // Good
  const activeUsers = users.filter(user => user.status === 'active');
  const handleDeleteAccount = () => { ... }

  // Bad (Python)
  def proc(d: dict) -> bool:

  // Good (Python)
  def validate_mood_entry(entry: MoodEntry) -> bool:
  ```

- **Keep functions and components focused** — Follow SOLID principles sensibly.
  If a React component exceeds ~300 lines or a Python function exceeds ~50
  lines, consider whether it's doing too many _unrelated_ things. A 400-line
  component that handles one complex screen coherently is fine. A 200-line
  component that mixes form logic, API calls, and unrelated UI is not. When
  suggesting a split, explain _why_ — e.g. _"This component handles both the
  form validation and the list rendering — extracting `MemberList` would make
  each piece testable independently."_ Don't break things up just to hit a line
  count. On the client, extract sub-components or custom hooks. On the server,
  extract to services or utility functions.

## Naming Conventions

| Item             | Convention            | Example                 |
| ---------------- | --------------------- | ----------------------- |
| Feature folder   | `kebab-case`          | `user-profile/`         |
| Screen component | `PascalCase + Screen` | `SettingsScreen.tsx`    |
| Hook             | `camelCase + use`     | `useSettings.ts`        |
| Store            | `camelCase + Store`   | `preferencesStore.ts`   |
| Type file        | `camelCase`           | `preferences.ts`        |
| Type barrel      | `types.ts`            | `types.ts` (re-exports) |
| Validator file   | `camelCase`           | `validator.ts`          |
| Util file        | `camelCase`           | `storage.ts`            |
| UI component     | `PascalCase`          | `StatusDot.tsx`         |
| Python module    | `snake_case`          | `preferences_repo.py`   |
| Python class     | `PascalCase`          | `PreferencesService`    |

## Error Handling

- **React error boundaries** — Wrap feature-level screens with error boundaries
  to prevent full-app crashes. Show a fallback UI, not a white screen.
- **Try/catch at service boundaries** — Catch errors where async work happens
  (hooks, store actions, API calls), not deep in pure functions.
- **User-facing errors** — Show toast notifications or inline messages. Never
  swallow errors silently; never show raw stack traces to users.
- **Server errors** — FastAPI exception handlers return consistent JSON error
  responses (`{ "detail": "..." }`). Use HTTP status codes correctly.

## Environment & Secrets

- **Never commit `.env` files** — Use `.env.example` as a template with
  placeholder values. Actual `.env` is gitignored.
- **No hardcoded secrets** — API keys, URLs, and credentials come from
  environment variables, never from source code.
- **Pydantic Settings** (server) — Load config from `.env` via `BaseSettings`.
- **Expo config** (client) — Use `expo-constants` or `.env` via `dotenv` for
  runtime config.

## Performance

- **FlatList over ScrollView** — Always use `FlatList` (or `FlashList`) for
  lists of dynamic length. Never render unbounded data in a `ScrollView`.
- **Memoize only when measured** — Don't preemptively add `React.memo`,
  `useMemo`, or `useCallback` everywhere. Add them when you identify an actual
  re-render problem.
- **Avoid inline object/array creation in JSX** — `style={{ flex: 1 }}` in a
  render body creates a new object every render. Hoist constants or use
  NativeWind classes instead.
- **Images and assets** — Use appropriately sized assets. Don't load a 4K image
  for a 40px avatar.

## Project Commands

| Command          | What it does          |
| ---------------- | --------------------- |
| `pnpm dev`       | Start Expo dev server |
| `pnpm lint`      | Lint all packages     |
| `pnpm format`    | Format with Prettier  |
| `pnpm typecheck` | TypeScript check all  |

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
architectural change, ask the user: _"Should I write an ADR for this decision?"_
ADRs live in `docs/ADR/ADR-{NNN}-{slug}.md` and must be added to the ADR
`README.md` index.

**Rule — be nice to your future self**: After building or modifying anything,
pause and ask yourself: _"If a new Claude session landed here with zero context,
would the folder structure, file names, and AGENTS.md make this understandable?"_
Agents have limited context windows — the codebase must be self-explanatory.
Every folder with non-obvious responsibility should have an `AGENTS.md`. Every
architectural boundary should be documented where it lives, not in a distant doc.

**Rule — human docs too**: `AGENTS.md` is for AI agents. Humans need `README.md`.
After building a significant feature or module, ask: _"Should I add a README.md
here with Mermaid diagrams showing how this works?"_ READMEs should explain the
**why** and **how** — data flow, architecture decisions, component relationships
— with diagrams, not just file lists.

**Rule — clean architecture check**: After implementing a feature, verify:
does this follow the project's layered architecture? Are boundaries respected
(domain is pure, features are self-contained, stores don't import from features)?
If something feels wrong, refactor before moving on.

**Rule — check your own work**: After building a feature, review what you wrote.
Run lints, tests, and verify the code actually works. When in doubt about an
approach, a design choice, or whether something is correct — stop and discuss
with the user rather than guessing.

**Rule — proximity updates**: When you edit code, you **must** also update the
nearest `AGENTS.md` and any `README.md` in the same directory or parent
directory. New features need a new feature-level `AGENTS.md`. Changed structure
means the parent `AGENTS.md` navigation tables and file lists must match.

**Rule — single source of truth**: Never document the same fact in two places.
If something is defined in `AGENTS.md`, don't repeat it in `README.md` — link
to it. If a type is defined in `tokens.ts`, don't re-list the values in a doc.
Duplication guarantees one copy goes stale.

**Rule — examples over descriptions**: When documenting a pattern or convention,
include a short code example. _"Use React Query for server state"_ is vague.
A 3-line snippet showing the hook pattern is immediately actionable for both
agents and humans.

**Rule — broken links check**: When moving or renaming files, grep all markdown
files for references to the old path. Broken links in docs are invisible rot —
catch them at the source.

**Rule — stale doc = bug**: Treat outdated documentation with the same urgency
as a code bug. If you spot a doc that contradicts the code, fix it immediately
or flag it to the user. Don't leave it for later.

**Rule — living docs**: `docs/ARCHITECTURE.md`, `docs/WORKFLOW.md`, and
`docs/guides/DEVELOPER-GUIDE.md` are living documents, not write-once artifacts.
When significant architecture changes happen (new layers, new packages, changed
data flow), update `ARCHITECTURE.md` and its Mermaid diagrams. When the workflow
or process changes (new steps, new tools, changed conventions), update
`WORKFLOW.md`. When setup steps, commands, or troubleshooting change, update the
developer guide. These docs are only useful if they match reality.

**Rule — last updated date**: Every documentation file (`AGENTS.md`, `README.md`,
`CLAUDE.md`, ADRs, guides) must include a `Last updated: YYYY-MM-DD` line. When
you modify a doc, update this date. This makes it easy to spot stale docs at a
glance.

**Rule — session end**: If you changed the code, check if the docs still match.
Ask the user before the session ends: _"Should I update any documentation to
reflect what we changed?"_

## Temporary Agent Files

Use `.context/` for session handoff notes, scratchpads, and temporary agent
files. This directory is gitignored — it is local-only and never committed.
Do not store permanent documentation here; use `docs/` for that.
