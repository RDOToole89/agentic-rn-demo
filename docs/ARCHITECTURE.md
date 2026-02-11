# Architecture

## Overview

This app follows a **layered architecture** with strict dependency rules.
The goal is clear boundaries, testable logic, and a codebase that both humans
and AI agents can navigate predictably.

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

**Dependency Rule**: Each layer may only import from layers below it. Never up.

## Data Flow

Every user action follows the same path:

```
User taps "Save"
  → SettingsScreen calls useSettings hook
    → Hook calls store action (Zustand)
      → Store action calls domain use-case
        → Use-case calls service interface
          → Service implementation writes to AsyncStorage
```

This is intentionally verbose for a small app. The point is **demonstrating
the pattern**, not optimizing for minimal code.

## Folder Structure

```
apps/mobile/
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
│       └── ThemeContext.tsx       # React Context provider
│
packages/
├── core/                         # Shared types & utilities
│   └── src/types.ts              # Result<T, E> type
└── ui/                           # Shared UI components
    └── src/Button.tsx            # Reusable Button component
```

## How to Add a New Feature

1. **Create the feature folder**: `src/features/{feature-name}/`
2. **Add the screen**: `{FeatureName}Screen.tsx`
3. **Add a feature-level AGENTS.md** describing purpose, files, dependencies
4. **Create a route file**: `app/{feature-name}.tsx` that re-exports the screen
5. **If new data is needed**:
   - Add entity in `domain/entities/`
   - Add use-case in `domain/use-cases/`
   - Add store or extend existing store in `shared/store/`
6. **If external integration is needed**:
   - Add interface in `services/interfaces/`
   - Add implementation in `services/{provider}/`
7. **Write a story spec**: `docs/STORIES/STORY-XX-{feature-name}.md`

## How Agents Navigate This Repo

Agents use a **progressive disclosure** pattern:

```
Root AGENTS.md       → "What is this repo? Where do I go?"
App AGENTS.md        → "What are the layers? Where does code go?"
Feature AGENTS.md    → "What does this feature do? How do I extend it?"
```

Each level adds specificity without repeating information from the level above.
An agent working on the Settings feature only needs to read:
1. Root AGENTS.md (1 min)
2. App AGENTS.md (2 min)
3. Feature AGENTS.md (30 sec)

Total context load: ~600 tokens. Enough to make correct decisions.
