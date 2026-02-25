# ADR-003: Layered Architecture with Strict Boundaries

**Status**: Accepted

## Context

AI agents need predictable code placement rules. Without clear boundaries,
agents produce inconsistent code — calling AsyncStorage from components,
mixing business logic into UI, creating circular dependencies.

## Decision

Adopt a **4-layer architecture** with strict dependency rules:

```
app/           → Routing (thin wrappers only)
src/features/  → UI + feature hooks
src/domain/    → Pure business logic (zero framework imports)
src/services/  → External system adapters (behind interfaces)
```

**Dependency Rule**: Each layer may only import from layers below it. Never up.

## Data Flow

```
User Action → Screen → Hook → Zustand Store → Use-Case → Service → Storage
```

## Boundary Enforcement

| Layer       | May Import                                  | Must NOT Import                   |
| ----------- | ------------------------------------------- | --------------------------------- |
| `app/`      | `features/`                                 | `domain/`, `services/`, `shared/` |
| `features/` | `domain/`, `services/`, `shared/`, `theme/` | Other features                    |
| `domain/`   | `services/interfaces/` (types only)         | React, Expo, AsyncStorage         |
| `services/` | External libraries                          | `features/`, `domain/entities/`   |

## Consequences

- **Positive**: Agents always know where to put new code (decision tree in AGENTS.md)
- **Positive**: Domain is unit-testable without mocks (pure functions)
- **Positive**: Service swaps don't ripple through the codebase
- **Negative**: More files for simple operations (intentional — demonstrates the pattern)
- **Negative**: Boilerplate for small features (acceptable for demo purposes)
