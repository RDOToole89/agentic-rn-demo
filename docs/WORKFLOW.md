# Workflow: Architecture-First Development

## The Loop

```
1. PLAN        Write a story spec (docs/STORIES/STORY-XX-*.md)
      ↓
2. STRUCTURE   Define boundaries — which layers are touched?
      ↓
3. EXECUTE     Agent (or human) implements against the spec
      ↓
4. REVIEW      Human reviews PR against the story's acceptance criteria
      ↓
5. MERGE       Ship it
```

This is **not** "vibe coding". Every change starts with a written spec.
The agent reads the spec, the architecture docs, and the relevant AGENTS.md
files before writing a single line of code.

## Story Specs

Every feature or change gets a story spec in `docs/STORIES/`.

A story spec contains:
- **Title** and one-line summary
- **Context** — why are we building this?
- **Acceptance Criteria** — what does "done" look like?
- **Constraints** — what must NOT happen?
- **Files Likely Touched** — helps agents (and reviewers) scope the change
- **Out of Scope** — explicitly what we're NOT doing

See `docs/STORIES/STORY-02-add-feature-settings.md` for a complete example.

## GitHub Project Board Integration

Stories map to GitHub Issues. The workflow:

```
Story Spec (docs/STORIES/)
  → GitHub Issue (copy AC into issue body)
    → Branch (feat/XX-description)
      → PR (linked to issue)
        → Review + Merge
          → Issue auto-closes
```

### Recommended Labels

| Label           | Meaning                              |
|-----------------|--------------------------------------|
| `type:feat`     | New feature                          |
| `type:fix`      | Bug fix                              |
| `type:refactor` | Code improvement, no behavior change |
| `type:docs`     | Documentation only                   |
| `scope:mobile`  | Changes in `apps/mobile/`            |
| `scope:ui`      | Changes in `packages/ui/`            |
| `scope:core`    | Changes in `packages/core/`          |

### Branch Naming

Format: `{type}/{issue-number}-{short-description}`

```
feat/12-add-notifications
fix/15-dark-mode-flicker
refactor/18-extract-storage-hook
```

## PR Review Checklist

When reviewing a PR (human or AI-generated):

- [ ] Does it match the story's acceptance criteria?
- [ ] Are boundary rules respected? (domain has no framework imports)
- [ ] Is the service interface used — no direct AsyncStorage/API calls from UI?
- [ ] Does new code follow the naming conventions in AGENTS.md?
- [ ] Is there a feature-level AGENTS.md if a new feature was added?
- [ ] Are there no `any` types?
- [ ] Does `pnpm typecheck` pass?
- [ ] Does `pnpm lint` pass?

## Agent-Specific Workflow

When an AI agent picks up a story:

1. **Read** the story spec completely
2. **Read** the root AGENTS.md
3. **Read** the app-level AGENTS.md for the relevant app
4. **Read** any feature-level AGENTS.md files for features being modified
5. **Implement** the changes respecting all constraints
6. **Self-review** against the PR checklist above
7. **Create PR** with a summary referencing the story

The key insight: **the architecture documentation IS the prompt**.
Well-structured AGENTS.md files mean you don't need elaborate system prompts.
The codebase teaches the agent how to work in it.
