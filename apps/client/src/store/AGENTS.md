Last updated: 2026-02-26

> Zustand stores for **client-only app state**. Never put server data here.

## What Goes in Zustand

- UI state: theme, sidebar open/closed, modal visibility
- User preferences: dark mode, language, display settings
- App lifecycle: hydration status, onboarding flags, ready state
- Navigation state that isn't handled by Expo Router
- Ephemeral client state that doesn't come from an API

## What Does NOT Go in Zustand

- **Server data** — use React Query (`src/api/`). API responses, user profiles
  fetched from a backend, lists of items from a database — all React Query.
- **Form state** — use local component state or a form library, not global store.
- **Derived/computed values** — compute in the component or hook, don't cache
  in the store unless there's a real performance reason.
- **Cached API responses** — React Query handles caching, refetching,
  invalidation, and optimistic updates. Do not replicate this in Zustand.

## Rule of Thumb

> If the data comes from a server: **React Query**.
> If the data is local to the device: **Zustand**.

## Stores

| Store                 | Purpose                                      |
| --------------------- | -------------------------------------------- |
| `appStore.ts`         | Global app lifecycle state                   |
| `preferencesStore.ts` | User preferences (persisted to AsyncStorage) |

## Conventions

- One store per concern (don't put everything in a single mega-store)
- Store files use `camelCase + Store` naming: `appStore.ts`
- Export hooks: `useAppStore`, `usePreferencesStore`
- Stores may import from `src/lib/` — never from `src/features/`
- Keep stores thin — logic belongs in `lib/utils/` or hooks
