# AGENTS.md — App Level (Mobile)

> You are inside `apps/mobile/`. This is the Expo React Native app.
> For monorepo-wide rules, see the root `AGENTS.md`.

## Stack

- **Expo SDK 54** / React Native 0.81 / React 19
- **Expo Router 6** (file-based routing)
- **Zustand 5** (state management)
- **AsyncStorage** (local persistence)

## Architecture Layers

```
app/                 Routes (Expo Router file-based routing)
  ↓ imports from
src/features/        Feature modules (screen + hooks + components)
  ↓ calls
src/domain/          Pure business logic (entities + use-cases)
  ↓ depends on
src/services/        Persistence & API interfaces + implementations
```

**Data flow**: `Screen → Store action → Use-case → Service → Storage`

## Folder Responsibilities

| Folder            | Contains                        | May Import From                    |
|-------------------|---------------------------------|------------------------------------|
| `app/`            | Route files (thin wrappers)     | `src/features/`                    |
| `src/features/`   | Screens, hooks, components      | `domain/`, `services/`, `shared/`, `theme/` |
| `src/domain/`     | Entities, use-case functions     | `services/interfaces/` (types only)|
| `src/services/`   | Interface defs + implementations | External libs (AsyncStorage, etc.) |
| `src/shared/`     | Cross-feature stores, hooks     | `domain/`, `services/`             |
| `src/theme/`      | Colors, ThemeContext             | `shared/store/`                    |

## Decision Tree: Where Does New Code Go?

```
Is it a new screen?
  → Create a new feature folder: src/features/{name}/
  → Add a route file in app/{name}.tsx that re-exports the screen
  → Add a feature-level AGENTS.md

Is it a new entity or business rule?
  → src/domain/entities/ or src/domain/use-cases/

Is it a new external integration?
  → Define interface in src/services/interfaces/
  → Implement in src/services/{provider}/

Is it shared across features?
  → src/shared/components/, src/shared/hooks/, or src/shared/store/

Is it a style or theme change?
  → src/theme/colors.ts or src/theme/ThemeContext.tsx
```

## Naming Conventions

| Item              | Convention              | Example                    |
|-------------------|-------------------------|----------------------------|
| Feature folder    | `kebab-case`            | `user-profile/`            |
| Screen component  | `PascalCase + Screen`   | `SettingsScreen.tsx`       |
| Hook              | `camelCase + use`       | `useSettings.ts`           |
| Entity            | `PascalCase`            | `UserPreferences.ts`       |
| Use-case file     | `camelCase`             | `preferences.ts`           |
| Service interface | `I + PascalCase`        | `IStorageService.ts`       |
| Store             | `camelCase + Store`     | `preferencesStore.ts`      |

## State Management

- **Zustand** for global state (preferences, auth, etc.)
- Stores live in `src/shared/store/`
- Store actions delegate to domain use-cases — stores are thin wrappers
- Never call services directly from a component

## React 19 Patterns

- Use `use()` instead of `useContext()` for reading context
- Context providers use `<Context value={}>` instead of `<Context.Provider value={}>`

## Feature-Level AGENTS.md

Every feature folder should contain its own `AGENTS.md` describing:
- What the feature does
- Its screens, hooks, and components
- Dependencies on domain/services
- Any constraints or gotchas
