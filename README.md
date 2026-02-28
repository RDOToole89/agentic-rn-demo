# agentic-rn-demo

A full-stack monorepo demonstrating **architecture-first development with
AI-assisted workflows** — built with Expo (iOS, Android, Web) and FastAPI.

Created for a developer meetup talk: _"Architecture-First Development in the Age
of Agents — Practical React Native workflows with AI"_

## What This Project Demonstrates

- **Layered AGENTS.md files** — progressive disclosure from root → app → feature
  so AI agents understand the codebase at every level
- **Story-driven development** — every change starts with a written spec in
  `docs/STORIES/`, synced to a GitHub project board
- **Hexagonal architecture** — clean separation of domain, application, and
  infrastructure on both client and server
- **Generated API contracts** — OpenAPI spec → TypeScript types + React Query
  hooks via Orval, ensuring client and server stay in sync
- **Git hooks as quality gates** — Lefthook enforces formatting, linting,
  type-checking, and commit conventions for both humans and AI agents

## Architecture

```mermaid
flowchart TD
    subgraph Client["apps/client — Expo 54 · React Native 0.81"]
        direction TB
        Router["Expo Router 6\nFile-based routes"]
        Features["Feature Modules\nhome · pulse · settings"]

        subgraph ClientData["Data Layer"]
            direction LR
            RQ["React Query 5\nServer state + cache"]
            Zustand["Zustand 5\nLocal UI state"]
        end

        Theme["NativeWind v4\nDesign tokens · Tailwind v4"]

        Router --> Features
        Features --> ClientData
        Features --> Theme
    end

    subgraph Server["apps/server — FastAPI · Python"]
        direction TB
        API["API Layer\nRoutes · Schemas · DI"]
        Services["Application Layer\nUse-case orchestration"]

        subgraph ServerCore["Core"]
            direction LR
            Domain["Domain\nPure business logic"]
            Infra["Infrastructure\nSQLAlchemy · Repos"]
        end

        API --> Services --> ServerCore
    end

    subgraph Packages["Shared Packages"]
        direction LR
        Core["packages/core\nGenerated types + hooks"]
        UI["packages/ui\nShared components"]
    end

    Core -. "types + hooks" .-> RQ
    RQ -. "HTTP" .-> API
    Infra --> DB[(SQLite)]
    Zustand --> AS[(AsyncStorage)]

    style Router fill:#f3e5f5,stroke:#7b1fa2,color:#000
    style Features fill:#e3f2fd,stroke:#1565c0,color:#000
    style RQ fill:#fff3e0,stroke:#ef6c00,color:#000
    style Zustand fill:#e8f5e9,stroke:#2e7d32,color:#000
    style Theme fill:#fce4ec,stroke:#c62828,color:#000
    style API fill:#e3f2fd,stroke:#1565c0,color:#000
    style Services fill:#f5f5f5,stroke:#616161,color:#000
    style Domain fill:#e8f5e9,stroke:#2e7d32,color:#000
    style Infra fill:#fff3e0,stroke:#ef6c00,color:#000
    style Core fill:#e0f7fa,stroke:#00838f,color:#000
    style UI fill:#e0f7fa,stroke:#00838f,color:#000
```

Arrows show allowed imports — each layer may only import from layers below it.

For the full system architecture with all sub-layers, see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Tech Stack

| Layer      | Technology                                           |
| ---------- | ---------------------------------------------------- |
| Client     | Expo 54, React Native 0.81, React 19                 |
| Routing    | Expo Router 6 (file-based)                           |
| Styling    | NativeWind v4 + Tailwind CSS v4, design tokens       |
| State      | Zustand 5 (local), TanStack React Query 5 (server)   |
| Server     | FastAPI, SQLAlchemy 2.x, Pydantic                    |
| Database   | SQLite (swappable to PostgreSQL via `DATABASE_URL`)  |
| API Client | Orval-generated hooks + types from OpenAPI spec      |
| Tooling    | pnpm workspaces, Volta (Node 22), Lefthook, Prettier |

## Features

### Home Dashboard

Full dashboard landing screen with navigation cards, team pulse widget, and
activity feed.

### Team Pulse

Mood tracking dashboard — view team members, submit mood entries, see mood
distribution, and generate AI standup summaries from team data.

### Settings

User preferences with dark mode toggle and username editing, persisted to the
backend API.

## Quick Start

```bash
# Prerequisites: Node 22 (managed by Volta), pnpm, Python 3.11+, uv

# Install dependencies
pnpm install

# Start client only
pnpm dev

# Start client + server together
pnpm dev:all

# Start server only
pnpm dev:server
```

The client runs on `http://localhost:8081` and the server on `http://localhost:8000`.

## Project Structure

```
agentic-rn-demo/
├── apps/
│   ├── client/              Expo app — iOS, Android, Web
│   │   ├── app/             File-based routes (Expo Router)
│   │   └── src/
│   │       ├── features/    Self-contained feature modules
│   │       │   ├── home/    Dashboard with widgets
│   │       │   ├── pulse/   Team mood tracking + AI standup
│   │       │   └── settings/ User preferences
│   │       ├── store/       Zustand stores (local state only)
│   │       ├── theme/       Design tokens + NativeWind bridge
│   │       └── lib/         Shared types, hooks, utilities
│   └── server/              FastAPI backend (hexagonal architecture)
│       └── src/
│           ├── api/         Routes, schemas, dependencies
│           ├── application/ Service layer (use-case orchestration)
│           ├── domain/      Pure business logic + validation
│           ├── infrastructure/ Database, ORM, repositories
│           └── seeds/       Demo data seeding
├── packages/
│   ├── core/                Generated API client, types, React Query hooks
│   └── ui/                  Shared UI component library
└── docs/
    ├── ARCHITECTURE.md      System diagrams, DB schema, folder maps
    ├── WORKFLOW.md           Dev process + PR checklist
    ├── STORIES/             Feature specs with acceptance criteria
    ├── ADR/                 Architecture Decision Records (10 ADRs)
    ├── audits/              Architecture + AI strategy audits
    └── guides/              Developer onboarding guide
```

## API Endpoints

| Endpoint                        | Method | Description              |
| ------------------------------- | ------ | ------------------------ |
| `/health`                       | GET    | Health check             |
| `/api/v1/preferences/{user_id}` | GET    | Get user preferences     |
| `/api/v1/preferences/{user_id}` | PUT    | Update user preferences  |
| `/api/v1/team`                  | GET    | List all team members    |
| `/api/v1/team/{id}`             | GET    | Get a single team member |
| `/api/v1/team/{id}/mood`        | POST   | Submit a mood entry      |

Interactive API docs available at `GET /docs` (Swagger UI) when the server is running.

## Scripts

| Command             | Description                             |
| ------------------- | --------------------------------------- |
| `pnpm dev`          | Start Expo dev server                   |
| `pnpm dev:server`   | Start FastAPI server with hot reload    |
| `pnpm dev:all`      | Start client + server concurrently      |
| `pnpm lint`         | Lint all packages                       |
| `pnpm format`       | Format with Prettier                    |
| `pnpm typecheck`    | TypeScript check all packages           |
| `pnpm generate:api` | Regenerate API client from OpenAPI spec |

## Documentation

| Document               | Purpose                                   |
| ---------------------- | ----------------------------------------- |
| `AGENTS.md` (3 levels) | AI agent context — root, app, and feature |
| `CLAUDE.md`            | Claude Code session configuration         |
| `docs/ARCHITECTURE.md` | System diagrams, DB schema, folder maps   |
| `docs/WORKFLOW.md`     | Development process and PR checklist      |
| `docs/STORIES/`        | Feature specs with acceptance criteria    |
| `docs/ADR/`            | Architecture Decision Records             |
| `docs/guides/`         | Developer onboarding and troubleshooting  |

## Architecture Decisions

This project has 10 documented ADRs covering key decisions:

1. pnpm monorepo structure
2. Expo SDK 54 as the app framework
3. Layered client architecture
4. Zustand for client-only state
5. Expo Router for file-based navigation
6. Service interface pattern
7. Layered AGENTS.md for AI context
8. Story-driven development workflow
9. Renaming `mobile` to `client` for cross-platform clarity
10. Hexagonal backend architecture

See `docs/ADR/README.md` for the full index.
