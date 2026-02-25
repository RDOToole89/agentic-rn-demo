# AGENTS.md — App Level (Client)

> You are inside `apps/client/`. This is the Expo app (iOS, Android, Web).
> For monorepo-wide rules, see the root `AGENTS.md`.

Last updated: 2026-02-25

## Stack

- **Expo SDK 54** / React Native 0.81 / React 19 / react-native-web
- **Expo Router 6** (file-based routing)
- **NativeWind v5** / Tailwind CSS v4 (utility-first styling via `className`)
- **Zustand 5** (state management)
- **TanStack Query** (async data fetching)
- **AsyncStorage** (local persistence)
- **@agentic-rn/core** (generated API types + React Query hooks from OpenAPI)

## Architecture Layers

```
app/                 Routes (Expo Router file-based routing)
  ↓ imports from
src/features/        Feature modules (screen + hooks + components)
  ↓ uses
src/store/           Zustand stores (global state)
src/api/             React Query client + key factories
  ↓ uses
src/lib/             Shared types, utils, hooks
src/theme/           Design tokens (tokens.ts) + theme sync (ThemeContext.tsx)
src/tw/              NativeWind re-exports + cn() utility
```

**Data flow**: `Screen → Hook → Store action → Storage util → AsyncStorage`

## Styling (NativeWind v5 / Tailwind CSS v4)

All styling uses NativeWind `className` props with Tailwind CSS v4 utilities.
No `StyleSheet.create()` in new code.

### Key files

| File                         | Role                                                                                   |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| `src/global.css`             | Design system: color scales, semantic tokens via `light-dark()`, `@theme` registration |
| `src/theme/tokens.ts`        | Brand hex constants for JS access (Switch trackColor, StatusBar)                       |
| `src/theme/ThemeContext.tsx` | `useThemeSync()` — syncs Zustand darkMode → NativeWind colorScheme                     |
| `src/tw/index.tsx`           | Re-exports RN components + `cn()` utility for class merging                            |

### How to style a component

```tsx
import { View, Text, cn } from '@/tw';

// Semantic tokens adapt to dark mode automatically via light-dark()
<View className="flex-1 bg-surface p-4">
  <Text className="text-lg text-text-primary">Hello</Text>
  <Text className={cn('text-sm', isActive && 'text-accent')}>Status</Text>
</View>;
```

### Design token classes

| Class prefix     | What it styles   | Examples                                                 |
| ---------------- | ---------------- | -------------------------------------------------------- |
| `bg-surface*`    | Backgrounds      | `bg-surface`, `bg-surface-elevated`, `bg-surface-sunken` |
| `text-text-*`    | Text colors      | `text-text-primary`, `text-text-secondary`               |
| `bg-accent`      | Brand green CTA  | `bg-accent`                                              |
| `bg-primary-*`   | Green scale      | `bg-primary-500`, `bg-primary-100`                       |
| `bg-secondary-*` | Blue scale       | `bg-secondary-500`                                       |
| `border-border`  | Borders          | `border-border`                                          |
| `bg-card`        | Card backgrounds | `bg-card`                                                |

### Dark mode

Dark mode is automatic — `light-dark()` CSS function handles it. No `dark:` prefix
needed for semantic tokens. Use `dark:` only for one-off overrides.

### RN components without className support

Some RN components (Switch, StatusBar) need raw color values:

```tsx
import { useRawColors } from '@/theme/ThemeContext';
const colors = useRawColors();
<Switch trackColor={{ false: colors.border, true: colors.accent }} />;
```

## Routing / Feature Boundary

`app/` is **only** for Expo Router route wiring — never put logic, hooks,
state, or UI components there. Route files are thin re-exports:

```tsx
// app/settings.tsx — correct
import { SettingsScreen } from '../src/features/settings/SettingsScreen';
export default SettingsScreen;
```

All screens, hooks, components, and business logic live in `src/features/`.
If a route needs a layout or provider, add it to `app/_layout.tsx` but keep
the implementation in `src/`.

## Folder Responsibilities

| Folder          | Contains                    | May Import From                                               |
| --------------- | --------------------------- | ------------------------------------------------------------- |
| `app/`          | Route files (thin wrappers) | `src/features/`                                               |
| `src/features/` | Screens, hooks, components  | `store/`, `api/`, `lib/`, `theme/`, `tw/`, `@agentic-rn/core` |
| `src/store/`    | Zustand stores              | `lib/`                                                        |
| `src/api/`      | QueryClient config          | `lib/`                                                        |
| `src/lib/`      | Types, utils, shared hooks  | `@agentic-rn/core`, external libs                             |
| `src/theme/`    | Design tokens, theme sync   | `store/`, `nativewind`                                        |
| `src/tw/`       | NativeWind re-exports, cn() | `react-native`, `nativewind`, `clsx`, `tailwind-merge`        |

## Decision Tree: Where Does New Code Go?

```
Is it a new screen?
  → Create a new feature folder: src/features/{name}/
  → Add a route file in app/{name}.tsx that re-exports the screen
  → Add a feature-level AGENTS.md

Is it a new data type or constant?
  → src/lib/types/

Is it a shared utility function?
  → src/lib/utils/

Is it a new API endpoint / query?
  → 1. Update OpenAPI spec in packages/core/openapi.json
  → 2. Run `pnpm generate:api` to regenerate hooks + types
  → 3. Use the generated hook from `@agentic-rn/core` in your feature

Is it global state?
  → src/store/

Is it a style or theme change?
  → Design tokens: src/global.css (@theme block)
  → JS color access: src/theme/tokens.ts
  → Never add inline hex values — add a token

Is it a new reusable UI primitive?
  → packages/ui (when created), or src/tw/ for wrappers
```

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

## API Integration (Generated Hooks)

API types and React Query hooks are **generated** from the OpenAPI spec via orval.
They live in `@agentic-rn/core` — never write API hooks by hand.

```typescript
import { useGetTeamMembers, useSubmitTeamMemberMood } from '@agentic-rn/core';

// Queries — fully typed, auto-generated query keys
const { data, isLoading } = useGetTeamMembers();

// Mutations — typed request + response
const mutation = useSubmitTeamMemberMood();
mutation.mutate({ id: '123', data: { emoji: '😊', label: 'happy' } });
```

See `packages/core/AGENTS.md` for the full codegen pipeline.

## State Management

- **Zustand** for global state (preferences, auth, etc.)
- Stores live in `src/store/`
- Store actions call `lib/utils/` directly for persistence
- Never call storage utils directly from a component

## React 19 Patterns

- Use `use()` instead of `useContext()` for reading context
- Context providers use `<Context value={}>` instead of `<Context.Provider value={}>`

## Feature-Level AGENTS.md

Every feature folder should contain its own `AGENTS.md` describing:

- What the feature does
- Its screens, hooks, and components
- Dependencies on store/lib/api
- Any constraints or gotchas
