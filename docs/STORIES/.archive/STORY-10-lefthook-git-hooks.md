---
id: STORY-10
title: Add Lefthook Git Hooks for Commit & Branch Enforcement
status: backlog
labels: [type:chore, scope:mono]
issue: 12
last_updated: 2026-02-26
---

# STORY-10: Add Lefthook Git Hooks for Commit & Branch Enforcement

## Summary

Install and configure Lefthook to enforce commit message conventions, branch
naming rules, and pre-commit quality checks — ensuring both humans and AI agents
follow the project's standards.

## Context

AI agents (Claude Code, Copilot, etc.) can create commits and branches that
drift from project conventions. The CLAUDE.md and AGENTS.md files document the
rules, but nothing enforces them at the git level. Lefthook is a fast,
zero-dependency git hooks manager that runs checks before commits and pushes,
catching violations before they reach the remote.

This is especially important for the Deloitte demo: when AI implements a story
live, the audience should see that the AI's commits pass the same quality gates
as a human developer's.

## Acceptance Criteria

- [ ] `lefthook` installed as a dev dependency at the monorepo root
- [ ] `lefthook.yml` configured at the repo root
- [ ] **commit-msg hook**: validates commit message format `type(scope): description`
  - Allowed types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`
  - Allowed scopes: `client`, `ui`, `core`, `mono`, or any feature name
  - Imperative mood, lowercase, max 72 chars for first line
  - Rejects commits with "Co-Authored-By: Claude" or AI attribution
- [ ] **pre-commit hook**: runs lint and typecheck on staged files
  - `pnpm lint` (or lint-staged equivalent)
  - `pnpm typecheck`
  - `pnpm format --check` (Prettier check, no auto-fix)
- [ ] **pre-push hook**: validates branch name matches pattern
  - Allowed patterns: `feat/STORY-{NN}-*`, `fix/STORY-{NN}-*`, `chore/*`, `docs/*`, `main`
  - Rejects pushes from branches that don't match
- [ ] `lefthook install` runs automatically via `pnpm install` (postinstall hook)
- [ ] Commit message validation script added to `.github/scripts/`
- [ ] Branch name validation script added to `.github/scripts/`
- [ ] Documentation updated: AGENTS.md mentions Lefthook enforcement

## Constraints

- Lefthook only — not Husky, lint-staged, or commitlint (fewer dependencies)
- Hooks must run fast (< 5 seconds) — no full test suite in pre-commit
- Commit-msg validation via a simple shell script (no Node.js commitlint)
- Must work on macOS and Linux
- `--no-verify` is allowed for emergency escapes but CLAUDE.md already tells AI to never use it
- Pre-commit lint should only check staged files where possible

## Commit Message Rules

```
Pattern: ^(feat|fix|refactor|docs|test|chore)\([a-z][a-z0-9-]*\): .{1,72}$

Valid:
  feat(client): add Team Pulse dashboard screen
  fix(pulse): correct status dot color mapping
  chore(mono): update lefthook config
  docs(core): add ADR for query key conventions

Invalid:
  Added new feature                    # no type(scope)
  feat: missing scope                  # no scope
  feat(client): Add Dashboard          # capital letter after colon
  feat(client): add extremely long commit message that exceeds the maximum... # > 72 chars
  feat(client): add feature\n\nCo-Authored-By: Claude  # AI attribution
```

## Branch Name Rules

```
Pattern: ^(feat|fix|chore|docs|refactor|test)/STORY-[0-9]+-[a-z0-9-]+$|^(main|develop)$

Valid:
  feat/STORY-05-team-pulse-dashboard
  fix/STORY-06-animation-flicker
  chore/update-deps

Invalid:
  feature/add-stuff                    # wrong prefix
  feat/team-pulse                      # missing STORY-NN
  STORY-05-dashboard                   # missing type prefix
```

## Files Touched

| File                                      | Action | Layer   |
| ----------------------------------------- | ------ | ------- |
| `package.json`                            | Modify | Config  |
| `lefthook.yml`                            | Create | Config  |
| `.github/scripts/validate-commit-msg.sh`  | Create | Scripts |
| `.github/scripts/validate-branch-name.sh` | Create | Scripts |
| `AGENTS.md`                               | Modify | Docs    |
| `pnpm-lock.yaml`                          | Modify | Config  |

## Out of Scope

- Full commitlint with Angular preset (overkill for this repo)
- Changelog generation from commit messages
- Semantic versioning automation
- CI enforcement of the same rules (separate story if needed)
- Spell checking in commit messages
