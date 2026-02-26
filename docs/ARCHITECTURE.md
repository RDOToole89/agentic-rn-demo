# Architecture

Last updated: 2026-02-26

## Overview

This app follows a **lightweight frontend architecture** targeting iOS, Android,
and Web from a single codebase using Expo, backed by a **hexagonal FastAPI
server**. The goal is clear boundaries, minimal boilerplate, and a codebase
that both humans and AI agents can navigate predictably.

> For the rationale behind each decision, see [docs/ADR/](./ADR/).

---

## System Architecture

```mermaid
flowchart TD
    subgraph Client["apps/client — Expo SDK 54 · iOS · Android · Web"]
        direction TB
        Router["<b>app/</b><br/>Expo Router 6<br/><i>thin route wrappers</i>"]

        Features["<b>src/features/</b><br/>Feature Modules<br/><i>screens · hooks · components</i>"]

        subgraph Data["Data Layer"]
            direction LR
            ClientAPI["<b>src/api/</b><br/>React Query<br/><i>query client · key factories</i>"]
            Store["<b>src/store/</b><br/>Zustand<br/><i>global client state</i>"]
        end

        subgraph Style["Style Layer"]
            direction LR
            Theme["<b>src/theme/</b><br/>Design Tokens<br/><i>NativeWind sync</i>"]
            TW["<b>src/tw/ + global.css</b><br/>NativeWind + Tailwind v4<br/><i>cn() · semantic tokens · light-dark()</i>"]
        end

        Lib["<b>src/lib/</b><br/>Shared Code<br/><i>types · utils · hooks</i>"]

        Router --> Features
        Features --> Data
        Features --> Style
        Store --> Lib
        ClientAPI --> Lib
    end

    subgraph Server["apps/server — FastAPI · Python 3.12"]
        direction TB
        ServerAPI["<b>src/api/</b><br/>HTTP Adapter<br/><i>routes · schemas · DI</i>"]
        AppLayer["<b>src/application/</b><br/>Use Cases<br/><i>service orchestration</i>"]

        subgraph Core_Server["Core"]
            direction LR
            ServerDomain["<b>src/domain/</b><br/>Business Logic<br/><i>pure Python</i>"]
            Infra["<b>src/infrastructure/</b><br/>DB Adapter<br/><i>SQLAlchemy · repos</i>"]
        end

        ServerAPI --> AppLayer --> Core_Server
    end

    subgraph Packages["Shared Packages"]
        direction LR
        Core["<b>packages/core</b><br/>OpenAPI Codegen<br/><i>generated hooks + types</i>"]
        UI["<b>packages/ui</b><br/>Shared Components"]
    end

    Lib --> AS[(AsyncStorage)]
    Infra --> DB[(SQLite)]
    ClientAPI -. "HTTP via customFetch" .-> ServerAPI
    Core -. "types + hooks" .-> ClientAPI

    style Router fill:#f3e5f5,stroke:#7b1fa2,color:#000
    style Features fill:#e3f2fd,stroke:#1565c0,color:#000
    style ClientAPI fill:#fff3e0,stroke:#ef6c00,color:#000
    style Store fill:#e8f5e9,stroke:#2e7d32,color:#000
    style Theme fill:#fce4ec,stroke:#c62828,color:#000
    style TW fill:#fce4ec,stroke:#c62828,color:#000
    style Lib fill:#f5f5f5,stroke:#616161,color:#000
    style ServerAPI fill:#e3f2fd,stroke:#1565c0,color:#000
    style AppLayer fill:#f5f5f5,stroke:#616161,color:#000
    style ServerDomain fill:#e8f5e9,stroke:#2e7d32,color:#000
    style Infra fill:#fff3e0,stroke:#ef6c00,color:#000
    style Core fill:#e0f7fa,stroke:#00838f,color:#000
    style UI fill:#e0f7fa,stroke:#00838f,color:#000
```

**Dependency Rule**: Arrows show allowed imports. Each layer may only import from layers below it. Never up.

---

## Database Schema

Currently: **SQLite** (swappable to PostgreSQL or other databases via `DATABASE_URL`).

> **Rule**: This diagram must be updated in the same PR as any migration that
> changes tables, columns, or relationships. It must always reflect the current
> state of the database.

```mermaid
erDiagram
    user_preferences {
        VARCHAR(100) user_id PK
        VARCHAR(50) username "default: 'Guest'"
        BOOLEAN dark_mode "default: false"
        TIMESTAMP created_at "UTC"
        TIMESTAMP updated_at "UTC"
    }
```

### Column Reference

| Table              | Column       | Type           | Constraints | Notes                              |
| ------------------ | ------------ | -------------- | ----------- | ---------------------------------- |
| `user_preferences` | `user_id`    | `VARCHAR(100)` | PK          | Alphanumeric, hyphens, underscores |
| `user_preferences` | `username`   | `VARCHAR(50)`  | NOT NULL    | Display name                       |
| `user_preferences` | `dark_mode`  | `BOOLEAN`      | NOT NULL    | UI preference                      |
| `user_preferences` | `created_at` | `TIMESTAMP`    | NOT NULL    | UTC, set on creation               |
| `user_preferences` | `updated_at` | `TIMESTAMP`    | NOT NULL    | UTC, set on every write            |

---

## Data Flow

```mermaid
sequenceDiagram
    participant User
    participant Screen as SettingsScreen
    participant Hook as useSettings
    participant Store as Zustand Store
    participant Utils as lib/utils/storage
    participant AS as AsyncStorage

    User->>Screen: Toggles dark mode
    Screen->>Hook: onToggleDarkMode()
    Hook->>Store: toggleDarkMode()
    Store->>Store: Create updated preferences
    Store->>Utils: setItem(key, updated)
    Utils->>AS: setItem(key, JSON)
    AS-->>Utils: void
    Utils-->>Store: void
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
┌─────────────────────────────────────────────────┐
│  app/              Routing (Expo Router)         │  ← Thin wrappers only
├─────────────────────────────────────────────────┤
│  src/features/     Feature Modules               │  ← Screens + hooks + UI
├─────────────────────────────────────────────────┤
│  src/store/        Zustand Stores                │  ← Global state
│  src/api/          React Query                   │  ← Async data fetching
├─────────────────────────────────────────────────┤
│  src/lib/          Shared Code                   │  ← Types, utils, hooks
│  src/theme/        Design Tokens + Theme Sync    │  ← tokens.ts, ThemeContext
│  src/tw/           NativeWind Re-exports         │  ← cn(), styled components
│  src/global.css    Tailwind CSS v4 Design System │  ← Scales, semantic tokens
└─────────────────────────────────────────────────┘
```

## Folder Structure

```
apps/client/
├── app/                          # Route definitions (Expo Router)
│   ├── _layout.tsx               # Root layout + providers + global.css import
│   ├── index.tsx                 # → HomeScreen
│   └── settings.tsx              # → SettingsScreen
│
├── src/
│   ├── api/                      # React Query infrastructure
│   │   ├── queryClient.ts        # QueryClient config
│   │   ├── keys.ts               # Query key factory
│   │   └── index.ts              # Barrel export
│   │
│   ├── features/                 # Feature modules
│   │   ├── home/                 # Home screen feature
│   │   │   ├── HomeScreen.tsx
│   │   │   └── AGENTS.md
│   │   └── settings/             # Settings screen feature
│   │       ├── SettingsScreen.tsx
│   │       ├── hooks/useSettings.ts
│   │       └── AGENTS.md
│   │
│   ├── lib/                      # Shared non-UI code
│   │   ├── types/                # Shared type definitions
│   │   │   ├── preferences.ts
│   │   │   └── index.ts
│   │   ├── utils/                # Utility functions
│   │   │   ├── storage.ts        # AsyncStorage wrapper
│   │   │   └── index.ts
│   │   └── hooks/                # Shared hooks
│   │       └── index.ts
│   │
│   ├── store/                    # Zustand stores
│   │   ├── preferencesStore.ts
│   │   └── index.ts
│   │
│   ├── theme/                    # Design tokens + NativeWind bridge
│   │   ├── tokens.ts             # Deloitte brand constants, scales, vars()
│   │   └── ThemeContext.tsx       # useThemeSync() + useRawColors()
│   │
│   ├── tw/                       # NativeWind component layer
│   │   └── index.tsx             # RN re-exports + cn() utility
│   │
│   └── global.css                # Tailwind CSS v4 design system
│                                 # (scales, semantic tokens, light-dark())
│
├── metro.config.js               # withNativeWind() wrapper
├── postcss.config.mjs            # @tailwindcss/postcss plugin
├── nativewind-env.d.ts           # NativeWind type declarations
└── tsconfig.json                 # Path aliases (@/tw, @/theme, etc.)

packages/
├── core/                         # OpenAPI codegen (orval)
│   ├── openapi.json              # API spec (source of truth)
│   └── src/
│       ├── generated/            # Auto-generated hooks + types
│       ├── fetcher.ts            # Custom fetch wrapper
│       └── index.ts              # Barrel export
└── ui/                           # Shared UI components (future)
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
   - Add types in `lib/types/`
   - Add or extend a Zustand store in `store/`
8. **If API integration is needed**:
   - Update OpenAPI spec in `packages/core/openapi.json`
   - Run `pnpm generate:api` to regenerate hooks + types
   - Use the generated hook from `@agentic-rn/core` in your feature
