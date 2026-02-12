# Context Handoff — agentic-rn-demo

> Use this file to bring a new Claude Code session up to speed.
> Paste or reference this at the start of your next conversation.

---

## What We're Building

### Presentation

- **Title**: "Architecture-First Development in the Age of Agents"
- **Subtitle**: "Practical React Native workflows with AI"
- **Audience**: Developers (internal meetup)
- **Format**: Markdown outline (to port to slides)
- **Duration**: TBD (not yet decided)
- **Code examples**: Real code from this demo repo

### Key Topics

1. **Layered AGENTS.md files** — progressive disclosure for AI agents (root → app → feature)
2. **How to structure a codebase for AI collaboration** — architecture docs as agent context
3. **Connecting an agent (Claude Code) to a GitHub Project board** — planning stages, issue-driven workflow
4. **Extending agent functionality with skills** — Claude Code skills system
5. **Story-driven development** — every change starts with a written spec
6. **The workflow loop**: Plan → Structure → Execute → Review → Merge

---

## The Demo Repo

### Repository

- **GitHub**: https://github.com/RDOToole89/agentic-rn-demo
- **Local path**: `/Users/rootoole/Desktop/gh-project/agentic-rn-demo`
- **Project Board**: https://github.com/users/RDOToole89/projects/5
- **Status**: 2 commits on main, app runs on iOS simulator, board synced

### Tech Stack (Latest Stable, Feb 2026)

| Package                    | Version     |
|----------------------------|-------------|
| Expo SDK                   | **54.0.33** |
| Expo Router                | **6.0.23**  |
| React                      | **19.1.0**  |
| React Native               | **0.81.5**  |
| React Native Reanimated    | **4.1.6**   |
| React Native Screens       | **4.16.0**  |
| Zustand                    | **5.x**     |
| AsyncStorage               | **2.2.0**   |
| TypeScript                 | **5.9.2**   |

**Expo Doctor**: 17/17 checks passed.

### React 19 Patterns Applied

- `use()` instead of `useContext()` in `ThemeContext.tsx`
- `<ThemeContext value={}>` instead of `<ThemeContext.Provider value={}>`

### File Structure

```
agentic-rn-demo/
├── AGENTS.md                          ← ROOT-LEVEL agent guide
├── README.md
├── package.json                       ← pnpm workspaces root
├── pnpm-workspace.yaml
├── .github/
│   ├── scripts/sync-stories.sh        ← Story → Issue + Board sync
│   └── workflows/project-automation.yml
├── .vscode/
│
├── docs/
│   ├── ARCHITECTURE.md                ← 4 Mermaid diagrams
│   ├── WORKFLOW.md                    ← Plan → Structure → Execute → Review → Merge
│   ├── ADR/                           ← 8 Architecture Decision Records
│   │   ├── ADR-001-pnpm-monorepo.md
│   │   ├── ADR-002-expo-sdk-54.md
│   │   ├── ADR-003-layered-architecture.md
│   │   ├── ADR-004-zustand-state.md
│   │   ├── ADR-005-expo-router.md
│   │   ├── ADR-006-service-interface.md
│   │   ├── ADR-007-layered-agents-md.md
│   │   └── ADR-008-story-driven-development.md
│   ├── STORIES/                       ← Story specs (synced to GitHub Issues)
│   │   ├── _TEMPLATE.md
│   │   ├── STORY-01-bootstrap.md      ← Done (issue #3)
│   │   └── STORY-02-add-feature-settings.md  ← Done (issue #4)
│   └── guides/
│       └── DEVELOPER-GUIDE.md         ← Setup, conventions, troubleshooting
│
├── apps/mobile/
│   ├── AGENTS.md                      ← APP-LEVEL agent guide
│   ├── app/                           ← Expo Router 6 (thin route wrappers)
│   │   ├── _layout.tsx                ← Providers + hydration + Stack nav
│   │   ├── index.tsx                  ← → HomeScreen
│   │   └── settings.tsx               ← → SettingsScreen
│   ├── src/
│   │   ├── domain/                    ← Pure logic (zero framework imports)
│   │   │   ├── entities/UserPreferences.ts
│   │   │   └── use-cases/preferences.ts
│   │   ├── services/                  ← Interfaces + implementations
│   │   │   ├── interfaces/IStorageService.ts
│   │   │   └── storage/asyncStorageService.ts
│   │   ├── features/
│   │   │   ├── home/
│   │   │   │   ├── HomeScreen.tsx
│   │   │   │   └── AGENTS.md          ← FEATURE-LEVEL agent guide
│   │   │   └── settings/
│   │   │       ├── SettingsScreen.tsx
│   │   │       ├── hooks/useSettings.ts
│   │   │       └── AGENTS.md          ← FEATURE-LEVEL agent guide
│   │   ├── shared/store/preferencesStore.ts  ← Zustand (delegates to use-cases)
│   │   └── theme/
│   │       ├── colors.ts              ← Light/dark tokens
│   │       └── ThemeContext.tsx        ← React 19 Context
│   ├── metro.config.js                ← Monorepo-aware Metro config
│   └── assets/
│
└── packages/
    ├── core/src/types.ts              ← Result<T, E> type
    └── ui/src/Button.tsx              ← Shared Button component
```

### Architecture: Data Flow

```
Screen → Zustand store action → Domain use-case → Service interface → AsyncStorage
```

Every layer only imports from the layer below. Domain has zero framework deps.

### Layered AGENTS.md System

| Level   | File                                    | Purpose                                    |
|---------|-----------------------------------------|--------------------------------------------|
| Root    | `/AGENTS.md`                            | "What is this repo? Where do I go?"        |
| App     | `/apps/mobile/AGENTS.md`                | "What are the layers? Decision tree"        |
| Feature | `/src/features/settings/AGENTS.md`      | "What does this feature do? How to extend?" |

Total context per task: ~1,100 tokens across 3 files.

### Story → Board Sync

```bash
# Create a story
cp docs/STORIES/_TEMPLATE.md docs/STORIES/STORY-XX-name.md

# Sync to GitHub Issues + Project Board
.github/scripts/sync-stories.sh

# Dry run first
.github/scripts/sync-stories.sh --dry-run
```

Board columns: **Backlog → Ready → In progress → In review → Done**

---

## What's Done

- [x] pnpm monorepo (apps/mobile, packages/ui, packages/core)
- [x] Expo SDK 54 app running on iOS simulator (verified)
- [x] Home screen: greeting, theme display, navigate to Settings
- [x] Settings screen: username edit (debounced), dark mode toggle
- [x] Full data flow through all architecture layers
- [x] Persistence via AsyncStorage (behind service interface)
- [x] Layered AGENTS.md files (root, app, feature)
- [x] 8 ADRs documenting every decision
- [x] Architecture doc with 4 Mermaid diagrams
- [x] Developer startup guide
- [x] Story sync script + GitHub Project Board (#5)
- [x] Issue labels (type + scope)
- [x] Git initialized, 2 commits pushed to GitHub
- [x] GitHub Actions workflow for auto-adding issues to board

## What's NOT Done Yet

- [ ] **Presentation slide deck** (markdown outline) — not started
- [ ] **Live demo scripting** — what to show during the talk
- [ ] **Additional feature story** to implement live during presentation
- [ ] **Skills demo** — showing Claude Code skills in action
- [ ] **Lefthook** pre-commit hooks (Prettier, ESLint, commitlint)
- [ ] **Commit conventions** enforcement (commitlint config)
- [ ] **PROJECT_TOKEN** secret for GitHub Actions auto-add (currently using CLI sync)
- [ ] Testing setup (jest/vitest)

---

## Decisions Made (see docs/ADR/ for full rationale)

| # | Decision | Choice |
|---|----------|--------|
| 001 | Monorepo tool | pnpm workspaces (no Nx/Turborepo) |
| 002 | SDK | Expo SDK 54, React 19, RN 0.81 |
| 003 | Architecture | 4-layer with strict boundaries |
| 004 | State | Zustand 5 (thin wrapper over use-cases) |
| 005 | Navigation | Expo Router 6 (file-based) |
| 006 | Persistence | AsyncStorage behind IStorageService interface |
| 007 | Agent context | Layered AGENTS.md progressive disclosure |
| 008 | Workflow | Story-driven development with board sync |

---

## How to Resume

```bash
cd /Users/rootoole/Desktop/gh-project/agentic-rn-demo
pnpm dev        # Start Expo dev server
# Press 'i' for iOS simulator
```

Git is clean, on `main`, tracking `origin/main`.
