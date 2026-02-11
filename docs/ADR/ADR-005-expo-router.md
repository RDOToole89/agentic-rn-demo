# ADR-005: Expo Router 6 File-Based Routing

**Status**: Accepted

## Context

We need navigation between screens. Options are React Navigation (imperative)
or Expo Router (file-based, built on React Navigation).

## Decision

Use **Expo Router 6** with file-based routing in the `app/` directory.

Route files are **thin wrappers** that re-export feature screens:

```typescript
// app/settings.tsx — 2 lines
import { SettingsScreen } from '../src/features/settings/SettingsScreen';
export default SettingsScreen;
```

## Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| React Navigation (direct) | Explicit, well-documented | Manual route config, more boilerplate |
| **Expo Router 6** | File-based, automatic deep linking, typed routes | Convention-driven, less explicit |

## Route Architecture

```
app/
├── _layout.tsx    → Providers + Stack navigator config
├── index.tsx      → re-exports HomeScreen
└── settings.tsx   → re-exports SettingsScreen
```

All business logic lives in `src/features/`. Route files contain zero logic.

## Consequences

- **Positive**: Adding a screen = creating 1 route file + 1 feature folder
- **Positive**: Automatic deep linking and URL support for web
- **Positive**: Typed routes with Expo Router's type generation
- **Negative**: Route files and feature files are in different directories (by design — separates routing from logic)
