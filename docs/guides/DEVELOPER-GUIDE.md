# Developer Startup Guide

Get up and running in under 5 minutes.

## Prerequisites

| Tool        | Version    | Check                                      |
| ----------- | ---------- | ------------------------------------------ |
| Node.js     | LTS (22.x) | `node -v`                                  |
| pnpm        | 9.x+       | `pnpm -v`                                  |
| Git         | 2.x+       | `git -v`                                   |
| GitHub CLI  | 2.x+       | `gh --version`                             |
| Expo Go app | Latest     | Install on your phone or use iOS Simulator |

### Optional

| Tool           | Purpose                                    |
| -------------- | ------------------------------------------ |
| Xcode          | iOS Simulator (macOS only)                 |
| Android Studio | Android Emulator                           |
| VS Code        | Recommended editor (see `.vscode/` config) |

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/RDOToole89/agentic-rn-demo.git
cd agentic-rn-demo

# 2. Install
pnpm install

# 3. Run
pnpm dev
```

This starts the Expo dev server. Then:

- Press **i** to open in iOS Simulator
- Press **a** to open in Android Emulator
- Press **w** to open in web browser
- Scan QR code with Expo Go on your phone

---

## Project Scripts

Run from the monorepo root:

| Command          | What it does                  |
| ---------------- | ----------------------------- |
| `pnpm dev`       | Start Expo dev server         |
| `pnpm lint`      | Lint all packages             |
| `pnpm format`    | Format with Prettier          |
| `pnpm typecheck` | TypeScript check all packages |

Run from `apps/client/`:

| Command        | What it does             |
| -------------- | ------------------------ |
| `pnpm start`   | Start Expo dev server    |
| `pnpm ios`     | Build and run on iOS     |
| `pnpm android` | Build and run on Android |
| `pnpm web`     | Start for web browser    |

---

## Tech Stack

| Layer       | Technology   | Version |
| ----------- | ------------ | ------- |
| Framework   | Expo SDK     | 54.0.33 |
| Language    | TypeScript   | 5.9.2   |
| UI          | React Native | 0.81.5  |
| React       | React        | 19.1.0  |
| Routing     | Expo Router  | 6.0.23  |
| State       | Zustand      | 5.x     |
| Persistence | AsyncStorage | 2.2.0   |
| Animations  | Reanimated   | 4.1.6   |

---

## Project Structure

```
agentic-rn-demo/
├── AGENTS.md              ← Start here (AI agent entry point)
├── apps/client/           ← Expo app (iOS, Android, Web)
│   ├── AGENTS.md          ← App-level agent guide
│   ├── app/               ← Routes (Expo Router)
│   └── src/
│       ├── domain/        ← Pure business logic (no framework deps)
│       ├── services/      ← External adapters (AsyncStorage)
│       ├── features/      ← Feature modules (screens + hooks)
│       ├── shared/        ← Cross-feature state (Zustand)
│       └── theme/         ← Color tokens + ThemeContext
├── packages/
│   ├── core/              ← Shared types (Result<T, E>)
│   └── ui/                ← Shared components (Button)
└── docs/
    ├── ARCHITECTURE.md    ← System design + Mermaid diagrams
    ├── WORKFLOW.md        ← Development process
    ├── ADR/               ← Architecture Decision Records
    ├── STORIES/           ← Story specs (synced to GitHub Issues)
    └── guides/            ← This file
```

---

## Architecture in 30 Seconds

**Data flows in one direction:**

```
Screen → Hook → Zustand Store → Domain Use-Case → Service → AsyncStorage
```

**Boundaries are strict:**

- `domain/` has **zero** framework imports (no React, no AsyncStorage)
- `services/` is the **only place** that imports external libraries
- `features/` are **self-contained** — each owns its screen + hooks
- `app/` contains **thin wrappers** that re-export from `features/`

**Why?** So AI agents know exactly where to put new code. See the decision
tree in `apps/client/AGENTS.md`.

---

## Story-Driven Development

Every change starts with a story spec:

```bash
# 1. Create a story
cp docs/STORIES/_TEMPLATE.md docs/STORIES/STORY-03-my-feature.md
# Edit the story with acceptance criteria

# 2. Sync to GitHub Issues + Project Board
.github/scripts/sync-stories.sh

# 3. Implement against the spec
# 4. Create PR referencing the story
# 5. Human review → merge
```

### Board Columns

**Backlog** → **Ready** → **In progress** → **In review** → **Done**

### Viewing the Board

```bash
# List all items
gh project item-list 5 --owner RDOToole89

# View a specific issue
gh issue view 3 --repo RDOToole89/agentic-rn-demo
```

---

## Working with AI Agents

This repo is designed for AI-assisted development. The key files:

| File                       | When to Read                                           |
| -------------------------- | ------------------------------------------------------ |
| `AGENTS.md` (root)         | Before any work — understand the repo                  |
| `apps/client/AGENTS.md`    | Before app changes — know the layers                   |
| `src/features/*/AGENTS.md` | Before feature changes — know the constraints          |
| `docs/STORIES/STORY-XX.md` | Before implementing — know the acceptance criteria     |
| `docs/ADR/`                | When questioning a decision — understand the rationale |

### Agent Workflow

```
1. Read story spec (what to build)
2. Read AGENTS.md chain (how to build it)
3. Implement (respecting boundaries)
4. Self-review (check PR checklist in WORKFLOW.md)
5. Create PR
```

---

## Commit Conventions

```
type(scope): description
```

| Part      | Values                                             |
| --------- | -------------------------------------------------- |
| **type**  | `feat`, `fix`, `refactor`, `docs`, `test`, `chore` |
| **scope** | `client`, `ui`, `core`, `mono`                     |

Examples:

```
feat(client): add notifications feature
fix(client): debounce username persistence
docs(mono): update ARCHITECTURE.md with new diagrams
chore(mono): configure lefthook pre-commit hooks
```

---

## Labels

| Label           | Color      | Meaning                  |
| --------------- | ---------- | ------------------------ |
| `type:feat`     | Green      | New feature              |
| `type:fix`      | Red        | Bug fix                  |
| `type:refactor` | Yellow     | Code improvement         |
| `type:docs`     | Blue       | Documentation            |
| `type:chore`    | Purple     | Maintenance              |
| `scope:client`  | Light blue | Changes in apps/client   |
| `scope:ui`      | Light blue | Changes in packages/ui   |
| `scope:core`    | Light blue | Changes in packages/core |
| `scope:mono`    | Light blue | Monorepo-level changes   |

---

## Troubleshooting

### Expo Doctor

```bash
cd apps/client && npx expo-doctor
```

All 17 checks should pass. If not, run:

```bash
npx expo install --fix
```

### Metro Bundler Issues

```bash
# Clear Metro cache
npx expo start -c
```

### pnpm Install Issues

```bash
# Clean install
rm -rf node_modules apps/client/node_modules pnpm-lock.yaml
pnpm install
```

### iOS Simulator Not Opening

```bash
# Open simulator manually
open -a Simulator

# Then press 'i' in the Expo terminal
```
