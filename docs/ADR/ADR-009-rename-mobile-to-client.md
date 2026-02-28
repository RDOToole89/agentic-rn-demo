Last updated: 2026-02-26

**Status**: Accepted

## Context

The Expo app in `apps/mobile/` targets iOS, Android, **and** web — calling it
"mobile" was misleading and excluded a third of its platform reach. Additionally,
the `scope:mobile` convention in commits, labels, and story frontmatter
reinforced the inaccuracy.

The name `client` accurately describes the workspace's role (the user-facing
application) and leaves room for a future `apps/server` workspace without
ambiguity.

## Decision

Rename the workspace directory from `apps/mobile` to `apps/client` and update
all references across the monorepo:

- Directory: `apps/mobile/` → `apps/client/`
- Package name: `"mobile"` → `"client"`
- Commit scope: `scope:mobile` → `scope:client`
- Labels: `scope:mobile` → `scope:client`
- All documentation, story frontmatter, and script references

## Alternatives Considered

| Name                 | Pros                                                  | Cons                                       |
| -------------------- | ----------------------------------------------------- | ------------------------------------------ |
| `apps/mobile` (keep) | No churn                                              | Inaccurate — implies mobile-only           |
| `apps/app`           | Short                                                 | Tautological, vague                        |
| `apps/client`        | Accurate, platform-agnostic, pairs with `apps/server` | Minor rename churn                         |
| `apps/frontend`      | Common in web projects                                | Less idiomatic for React Native ecosystems |

## Scope of Change

- `git mv apps/mobile apps/client`
- Updated `package.json` (root + app)
- Updated `AGENTS.md` (root + app)
- Updated `README.md`, `CONTEXT-HANDOFF.md`
- Updated all `docs/` files (architecture, workflow, guides, ADRs, stories, template)
- Updated `.github/scripts/sync-stories.sh`
- Regenerated `pnpm-lock.yaml`
- Added `react-native-web` dependency for web platform support

## Files NOT Changed

- `pnpm-workspace.yaml` — uses `apps/*` glob, no hardcoded path
- `app.json` — bundle ID is `com.demo.agenticrn`, unrelated
- `metro.config.js` — uses `__dirname`, no hardcoded paths
- `tsconfig.json` — relative paths only

## Consequences

- **Positive**: Name accurately reflects iOS + Android + Web support
- **Positive**: `scope:client` convention is future-proof for `apps/server`
- **Positive**: Documentation now consistently describes all three platforms
- **Negative**: One-time churn across docs and config (done in this commit)
- **Negative**: GitHub label `scope:mobile` on existing issues becomes stale (rename manually if needed)
