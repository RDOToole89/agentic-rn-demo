# Architecture Decision Records

ADRs document the key technical decisions made in this project, including
context, alternatives considered, and rationale.

## Index

| ADR                                              | Title                                           | Status   |
| ------------------------------------------------ | ----------------------------------------------- | -------- |
| [ADR-001](./ADR-001-pnpm-monorepo.md)            | pnpm Monorepo over Nx/Turborepo                 | Accepted |
| [ADR-002](./ADR-002-expo-sdk-54.md)              | Expo SDK 54 with React 19                       | Accepted |
| [ADR-003](./ADR-003-layered-architecture.md)     | Layered Architecture with Strict Boundaries     | Accepted |
| [ADR-004](./ADR-004-zustand-state.md)            | Zustand over Redux/Context for State Management | Accepted |
| [ADR-005](./ADR-005-expo-router.md)              | Expo Router 6 File-Based Routing                | Accepted |
| [ADR-006](./ADR-006-service-interface.md)        | AsyncStorage Behind Service Interface           | Accepted |
| [ADR-007](./ADR-007-layered-agents-md.md)        | Layered AGENTS.md Progressive Disclosure        | Accepted |
| [ADR-008](./ADR-008-story-driven-development.md) | Story-Driven Development with Board Sync        | Accepted |
| [ADR-009](./ADR-009-rename-mobile-to-client.md)  | Rename `apps/mobile` to `apps/client`           | Accepted |
| [ADR-010](./ADR-010-hexagonal-backend.md)        | Hexagonal Architecture for FastAPI Backend      | Accepted |

## Format

Each ADR follows the format:

- **Status**: Proposed / Accepted / Deprecated / Superseded
- **Context**: What situation or problem prompted the decision
- **Decision**: What we decided
- **Alternatives**: What else we considered
- **Consequences**: What follows from this decision
