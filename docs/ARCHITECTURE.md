# Architecture

## Overview

This app follows a **layered architecture** with strict dependency rules.
It targets iOS, Android, and Web from a single codebase using Expo.
The goal is clear boundaries, testable logic, and a codebase that both humans
and AI agents can navigate predictably.

> For the rationale behind each decision, see [docs/ADR/](./ADR/).

---

## System Architecture

```mermaid
graph TB
    subgraph Monorepo["agentic-rn-demo (pnpm workspaces)"]
        subgraph Client["apps/client — Expo SDK 54 (iOS · Android · Web)"]
            Router["app/<br/>Expo Router 6<br/><i>thin route wrappers</i>"]
            Features["src/features/<br/>Feature Modules<br/><i>screens + hooks + components</i>"]
            Shared["src/shared/<br/>Cross-Feature State<br/><i>Zustand stores</i>"]
            Domain["src/domain/<br/>Business Logic<br/><i>pure functions, zero I/O</i>"]
            Services["src/services/<br/>External Adapters<br/><i>AsyncStorage, APIs</i>"]
            Theme["src/theme/<br/>Color Tokens + Context"]
        end
        subgraph Packages["Shared Packages"]
            UI["packages/ui<br/>Shared Components"]
            Core["packages/core<br/>Shared Types"]
        end
    end

    Router --> Features
    Features --> Shared
    Features --> Domain
    Features --> Theme
    Shared --> Domain
    Shared --> Services
    Domain -.->|types only| Services
    Services --> AsyncStorage[(AsyncStorage)]

    style Domain fill:#e8f5e9,stroke:#2e7d32
    style Services fill:#fff3e0,stroke:#ef6c00
    style Features fill:#e3f2fd,stroke:#1565c0
    style Router fill:#f3e5f5,stroke:#7b1fa2
```

**Dependency Rule**: Arrows show allowed imports. Each layer may only import from layers below it. Never up.

---

## Data Flow

```mermaid
sequenceDiagram
    participant User
    participant Screen as SettingsScreen
    participant Hook as useSettings
    participant Store as Zustand Store
    participant UC as Use-Case
    participant Svc as IStorageService
    participant AS as AsyncStorage

    User->>Screen: Toggles dark mode
    Screen->>Hook: onToggleDarkMode()
    Hook->>Store: toggleDarkMode()
    Store->>UC: toggleDarkMode(service, current)
    UC->>UC: Create updated preferences
    UC->>Svc: savePreferences(updated)
    Svc->>AS: setItem(key, JSON)
    AS-->>Svc: void
    Svc-->>UC: void
    UC-->>Store: updated preferences
    Store-->>Hook: State update triggers re-render
    Hook-->>Screen: New darkMode value
    Screen-->>User: UI reflects dark theme
```

---

## Agent Context Flow

```mermaid
flowchart LR
    subgraph Progressive Disclosure
        Root["Root AGENTS.md<br/>~400 tokens<br/><i>What is this repo?</i>"]
        App["App AGENTS.md<br/>~500 tokens<br/><i>Layers + decision tree</i>"]
        Feature["Feature AGENTS.md<br/>~200 tokens<br/><i>This feature's details</i>"]
    end

    Root -->|"navigate to app"| App
    App -->|"navigate to feature"| Feature

    Agent((AI Agent)) -->|"1. Read"| Root
    Agent -->|"2. Read"| App
    Agent -->|"3. Read"| Feature
    Agent -->|"4. Implement"| Code[Write Code]

    style Root fill:#fff9c4
    style App fill:#fff9c4
    style Feature fill:#fff9c4
```

Total context per task: **~1,100 tokens** across 3 files.

---

## Development Workflow

```mermaid
flowchart TD
    A[Write Story Spec] -->|"docs/STORIES/STORY-XX.md"| B[Sync to Board]
    B -->|".github/scripts/sync-stories.sh"| C[GitHub Issue + Project Board]
    C --> D{Who implements?}
    D -->|Human| E[Create branch + implement]
    D -->|AI Agent| F[Agent reads AGENTS.md + story spec]
    F --> E
    E --> G[Create PR]
    G --> H[Human Review]
    H -->|Approved| I[Merge to main]
    H -->|Changes requested| E
    I --> J[Issue → Done on board]

    style A fill:#e8f5e9
    style F fill:#fff9c4
    style H fill:#ffcdd2
```

---

## Layers

```
┌─────────────────────────────────────────────┐
│  app/              Routing (Expo Router)     │  ← Thin wrappers only
├─────────────────────────────────────────────┤
│  src/features/     Feature Modules           │  ← Screens + hooks + UI
├─────────────────────────────────────────────┤
│  src/shared/       Cross-Feature State       │  ← Zustand stores
├─────────────────────────────────────────────┤
│  src/domain/       Business Logic            │  ← Pure functions, zero I/O
├─────────────────────────────────────────────┤
│  src/services/     External Integrations     │  ← AsyncStorage, APIs
└─────────────────────────────────────────────┘
```

## Folder Structure

```
apps/client/
├── app/                          # Route definitions (Expo Router)
│   ├── _layout.tsx               # Root layout + providers
│   ├── index.tsx                 # → HomeScreen
│   └── settings.tsx              # → SettingsScreen
│
├── src/
│   ├── domain/                   # Pure business logic
│   │   ├── entities/             # Data shapes (interfaces/types)
│   │   │   └── UserPreferences.ts
│   │   └── use-cases/            # Pure functions with injected deps
│   │       └── preferences.ts
│   │
│   ├── services/                 # External system adapters
│   │   ├── interfaces/           # Contracts (no implementations)
│   │   │   └── IStorageService.ts
│   │   └── storage/              # Concrete implementations
│   │       └── asyncStorageService.ts
│   │
│   ├── features/                 # Feature modules
│   │   ├── home/                 # Home screen feature
│   │   │   ├── HomeScreen.tsx
│   │   │   └── AGENTS.md         # Feature-level agent guide
│   │   └── settings/             # Settings screen feature
│   │       ├── SettingsScreen.tsx
│   │       ├── hooks/useSettings.ts
│   │       └── AGENTS.md         # Feature-level agent guide
│   │
│   ├── shared/                   # Cross-feature concerns
│   │   └── store/
│   │       └── preferencesStore.ts
│   │
│   └── theme/                    # Visual theming
│       ├── colors.ts             # Light/dark color tokens
│       └── ThemeContext.tsx       # React 19 Context provider
│
packages/
├── core/                         # Shared types & utilities
│   └── src/types.ts              # Result<T, E> type
└── ui/                           # Shared UI components
    └── src/Button.tsx            # Reusable Button component
```

## How to Add a New Feature

1. **Write a story spec**: `docs/STORIES/STORY-XX-{feature-name}.md`
2. **Sync to board**: `.github/scripts/sync-stories.sh`
3. **Create the feature folder**: `src/features/{feature-name}/`
4. **Add the screen**: `{FeatureName}Screen.tsx`
5. **Add a feature-level AGENTS.md** describing purpose, files, dependencies
6. **Create a route file**: `app/{feature-name}.tsx` that re-exports the screen
7. **If new data is needed**:
   - Add entity in `domain/entities/`
   - Add use-case in `domain/use-cases/`
   - Add store or extend existing store in `shared/store/`
8. **If external integration is needed**:
   - Add interface in `services/interfaces/`
   - Add implementation in `services/{provider}/`
