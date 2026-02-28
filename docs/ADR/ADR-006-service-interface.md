Last updated: 2026-02-11

**Status**: Accepted

## Context

The app persists user preferences to local storage. Without an abstraction,
AsyncStorage calls would spread through components, hooks, and stores — making
the code harder to test and impossible to swap implementations.

## Decision

Define an **IStorageService interface** that the domain depends on. Only one
file in the entire project imports AsyncStorage directly.

```
IStorageService (interface)
    ↑ depends on (types only)
domain/use-cases/preferences.ts
    ↑ called by
shared/store/preferencesStore.ts
    ↑ used by
features/settings/SettingsScreen.tsx
```

## The Interface

```typescript
interface IStorageService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
}
```

## Single Point of Contact

Only `services/storage/asyncStorageService.ts` imports `@react-native-async-storage/async-storage`.

## Consequences

- **Positive**: Domain use-cases are testable with a mock service (no AsyncStorage in tests)
- **Positive**: Can swap to MMKV, SecureStore, or an API without touching business logic
- **Positive**: Agents can't accidentally import AsyncStorage in the wrong layer
- **Negative**: Extra indirection for a simple key-value store (intentional for the demo)
