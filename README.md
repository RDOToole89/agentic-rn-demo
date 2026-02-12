# agentic-rn-demo

A demonstration monorepo for **architecture-first development with AI-assisted
workflows** using Expo (iOS, Android, Web).

Built for a developer meetup talk: *"Architecture-First Development in the Age
of Agents — Practical React Native workflows with AI"*

## Quick Start

```bash
# Install dependencies
pnpm install

# Start the Expo dev server
pnpm dev

# Or run directly
pnpm -C apps/client start
```

## Structure

```
agentic-rn-demo/
├── apps/client/       Expo app (iOS, Android, Web)
├── packages/ui/       Shared UI components
├── packages/core/     Shared types & utilities
└── docs/              Architecture, workflow, story specs
```

## Key Concepts

- **Layered AGENTS.md files** — Root → App → Feature progressive disclosure
- **Architecture documentation as agent context** — the codebase teaches AI how to work in it
- **Story-driven development** — every change starts with a written spec
- **Strict boundaries** — domain is pure, services are behind interfaces

## Documentation

| Document                  | Purpose                                    |
|---------------------------|--------------------------------------------|
| `AGENTS.md`               | AI agent entry point (root level)          |
| `apps/client/AGENTS.md`   | App-level architecture guide               |
| `docs/ARCHITECTURE.md`    | Folder structure and data flow             |
| `docs/WORKFLOW.md`        | Development process and PR checklist       |
| `docs/STORIES/`           | Feature specs with acceptance criteria     |

## Scripts

| Command          | Description                    |
|------------------|--------------------------------|
| `pnpm dev`       | Start Expo dev server          |
| `pnpm lint`      | Lint all packages              |
| `pnpm format`    | Format with Prettier           |
| `pnpm typecheck` | TypeScript check all packages  |
