# ADR-001: pnpm Monorepo over Nx/Turborepo

**Status**: Accepted

## Context

We need a monorepo structure to co-locate the client app and shared packages.
The industry standard tools are pnpm workspaces, Nx, Turborepo, and Yarn
workspaces.

## Decision

Use **pnpm workspaces** without a build orchestrator (no Nx, no Turborepo).

## Alternatives Considered

| Tool | Pros | Cons |
|------|------|------|
| Nx | Task caching, dependency graph, generators | Heavy config, steep learning curve, overkill for 1 app |
| Turborepo | Simple caching, fast pipelines | Extra dependency, config overhead for a small project |
| Yarn workspaces | Mature, well-known | pnpm is faster, stricter dependency resolution |

## Consequences

- **Positive**: Zero config overhead, AI agents understand the structure immediately
- **Positive**: pnpm's strict node_modules hoisting prevents phantom dependencies
- **Positive**: Context clarity — agents don't need to understand Nx/Turbo concepts
- **Negative**: No build caching (acceptable at this project size)
- **Negative**: Manual script orchestration for cross-package tasks
