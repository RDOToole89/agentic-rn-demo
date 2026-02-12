---
id: STORY-01
title: Bootstrap Monorepo
status: done
labels: [type:feat, scope:mono]
issue: 3
---

# STORY-01: Bootstrap Monorepo

## Summary
Set up the initial monorepo structure with a working cross-platform Expo app,
shared packages, layered architecture, and documentation.

## Context
We need a clean, professional starting point for demonstrating
architecture-first development with AI-assisted workflows. The repo must be
minimal but realistic — not a toy, not overengineered.

## Acceptance Criteria

- [ ] pnpm monorepo with `apps/client`, `packages/ui`, `packages/core`
- [ ] Expo app runs with `pnpm dev` (or `pnpm -C apps/client start`)
- [ ] Home screen displays a greeting and theme mode
- [ ] Navigation from Home to Settings works
- [ ] TypeScript strict mode enabled
- [ ] Layered architecture: domain / services / features / shared / theme
- [ ] Root, app-level, and feature-level AGENTS.md files exist
- [ ] docs/ARCHITECTURE.md explains the folder structure and data flow
- [ ] docs/WORKFLOW.md explains the development process
- [ ] Prettier and ESLint configured
- [ ] Path aliases configured for clean imports

## Constraints

- No external state management beyond Zustand
- No CSS-in-JS libraries (use StyleSheet)
- No unnecessary dependencies
- Domain layer must have zero framework imports

## Files Created

```
Root:        package.json, pnpm-workspace.yaml, .gitignore, .editorconfig,
             .prettierrc, .npmrc, AGENTS.md, README.md
Config:      .vscode/extensions.json, .vscode/settings.json
Docs:        docs/ARCHITECTURE.md, docs/WORKFLOW.md, docs/STORIES/STORY-01-*.md
Client:      apps/client/ (full app with all layers)
Packages:    packages/core/, packages/ui/
```

## Out of Scope

- Testing setup (will be a separate story)
- CI/CD pipelines
- Authentication
- API integration
- Deployment configuration
