# ADR-002: Expo SDK 54 with React 19

**Status**: Accepted

## Context

We need a cross-platform framework targeting iOS, Android, and Web. Expo
provides managed workflows, OTA updates, and a large plugin ecosystem. We
initially scaffolded with SDK 52 but upgraded to SDK 54 (latest stable,
Feb 2026).

## Decision

Use **Expo SDK 54** with **React 19.1.0** and **React Native 0.81.5**.

## Key Versions

| Package                 | Version |
| ----------------------- | ------- |
| expo                    | 54.0.33 |
| react                   | 19.1.0  |
| react-native            | 0.81.5  |
| expo-router             | 6.0.23  |
| react-native-reanimated | 4.1.6   |
| typescript              | 5.9.2   |

## React 19 Patterns Adopted

- `use()` replaces `useContext()` for reading context values
- `<Context value={}>` replaces `<Context.Provider value={}>`
- React Compiler compatibility (future-proofing)

## Consequences

- **Positive**: Latest stable, all 17/17 Expo Doctor checks pass
- **Positive**: React 19 patterns are forward-compatible with React Compiler
- **Positive**: New Architecture enabled (Fabric, TurboModules)
- **Negative**: Some community libraries may lag behind React 19 support
