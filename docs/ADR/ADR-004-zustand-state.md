Last updated: 2026-02-26

**Status**: Accepted

## Context

We need global state management for user preferences (username, dark mode)
that persists across screens and survives app restarts.

## Decision

Use **Zustand 5** as a thin state layer that delegates to domain use-cases.

## Alternatives Considered

| Option                     | Pros                                      | Cons                                            |
| -------------------------- | ----------------------------------------- | ----------------------------------------------- |
| Redux Toolkit              | Industry standard, devtools, middleware   | Heavy boilerplate, overkill for this scope      |
| React Context + useReducer | No dependency                             | Re-render issues, manual optimization needed    |
| Jotai                      | Atomic, minimal                           | Less common, harder for agents to pattern-match |
| **Zustand**                | Minimal API, no providers, selector-based | Less opinionated (pro and con)                  |

## Store Design Principle

Stores are **thin wrappers** — they hold state and delegate mutations to
domain use-cases:

```typescript
// Store action calls use-case, not AsyncStorage directly
toggleDarkMode: async () => {
  const current = { username: get().username, darkMode: get().darkMode };
  const updated = await toggleDarkMode(asyncStorageService, current);
  set(updated);
};
```

## Consequences

- **Positive**: Zero provider boilerplate (no Context wrapper needed)
- **Positive**: Selector-based subscriptions prevent unnecessary re-renders
- **Positive**: Store logic is testable (inject mock services)
- **Positive**: Agents find Zustand patterns highly predictable
- **Negative**: No built-in devtools in React Native (acceptable tradeoff)
