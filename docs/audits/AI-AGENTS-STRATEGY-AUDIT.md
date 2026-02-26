# AI-First Documentation Strategy Audit

Last updated: 2026-02-26

> Deep evaluation of the AGENTS.md system, CLAUDE.md configuration, and
> AI-agent documentation strategy across the agentic-rn-demo monorepo.

---

## Executive Summary

This repo implements a **best-in-class AI-first documentation strategy** — a
3-level AGENTS.md hierarchy that gives agents ~1,100 tokens of context per task,
backed by a comprehensive CLAUDE.md configuration and story-driven workflow.
The system is well-designed but has **consistency gaps**: missing dates on 64% of
AGENTS.md files, content duplication between CLAUDE.md and root AGENTS.md, and
no README.md files at app/package levels for human readers.

**Overall Score: 7.6/10** — excellent foundation, needs consistency polish.

---

## Scorecard

| Criterion               | Score | Notes                                             |
| ----------------------- | ----- | ------------------------------------------------- |
| Progressive disclosure  | 9/10  | ~1,100 tokens per task, clear 3-level hierarchy   |
| Navigation tables       | 7/10  | Missing `packages/ui` in root nav table           |
| Single source of truth  | 6/10  | Commit conventions duplicated + divergent         |
| Story-to-code flow      | 9/10  | Spec → sync → board → implement → PR              |
| Naming consistency      | 9/10  | Documented once in CLAUDE.md, followed everywhere |
| Architectural clarity   | 9/10  | 4 Mermaid diagrams in ARCHITECTURE.md             |
| Date currency           | 5/10  | Only 5 of 14 AGENTS.md files have dates           |
| Cross-references        | 7/10  | Good where present, gaps in server layers         |
| Agent-specific guidance | 8/10  | CLAUDE.md rules clearly flagged for Claude Code   |
| Handoff continuity      | 7/10  | CONTEXT-HANDOFF exists but rules not formalized   |

---

## The System

### Architecture

```
CLAUDE.md                    ← Claude Code configuration (~390 lines)
  ↓ references
AGENTS.md (root)             ← Repo overview, boundaries, commit rules (~98 lines)
  ↓ navigates to
├── apps/client/AGENTS.md    ← Client stack, layers, decision tree
│   ├── src/features/home/AGENTS.md
│   ├── src/features/pulse/AGENTS.md
│   ├── src/features/settings/AGENTS.md
│   ├── src/api/AGENTS.md
│   └── src/store/AGENTS.md
├── apps/server/AGENTS.md    ← Server stack, hexagonal layers
│   ├── src/api/AGENTS.md
│   ├── src/application/AGENTS.md
│   ├── src/config/AGENTS.md
│   ├── src/domain/AGENTS.md
│   └── src/infrastructure/AGENTS.md
└── packages/core/AGENTS.md  ← OpenAPI codegen pipeline
```

**Total: 14 AGENTS.md files** across 3 levels.

### Supporting Documentation

| Document                         | Purpose                             | Status   |
| -------------------------------- | ----------------------------------- | -------- |
| `docs/ARCHITECTURE.md`           | System diagrams + folder structure  | Current  |
| `docs/WORKFLOW.md`               | Development process + PR checklist  | Current  |
| `docs/ADR/ADR-007-*.md`          | Rationale for AGENTS.md strategy    | Accepted |
| `docs/ADR/ADR-008-*.md`          | Rationale for story-driven workflow | Accepted |
| `.context/CONTEXT-HANDOFF.md`    | Session continuity for agents       | Active   |
| `docs/guides/DEVELOPER-GUIDE.md` | Human onboarding guide              | Current  |

### Design Rationale (ADR-007)

Key thesis: _"The architecture documentation IS the prompt."_ Well-structured
AGENTS.md files eliminate the need for elaborate system prompts. The 3-level
hierarchy limits context to ~1,100 tokens per task — far below context window
limits while providing complete navigational context.

---

## Detailed Findings

### 1. Progressive Disclosure — 9/10

The 3-level system works as designed:

| Level   | Example                        | Tokens | What it answers               |
| ------- | ------------------------------ | ------ | ----------------------------- |
| Root    | `/AGENTS.md`                   | ~400   | "What is this repo?"          |
| App     | `apps/client/AGENTS.md`        | ~500   | "What are the layers?"        |
| Feature | `src/features/pulse/AGENTS.md` | ~200   | "How does this feature work?" |

Agents can stop reading at any level once they have enough context. A simple
change to a feature only requires reading 3 files. This is efficient and
well-documented in ADR-007.

**Deduction (-1):** Root AGENTS.md could include a brief "Quick Start" section
for agents that just need the most common commands (dev server, lint, typecheck).

### 2. Navigation Tables — 7/10

Root AGENTS.md has a navigation table with 7 entries:

| Task                            | File                                          | Present? |
| ------------------------------- | --------------------------------------------- | -------- |
| Understand architecture         | `docs/ARCHITECTURE.md`                        | ✅       |
| Understand workflow             | `docs/WORKFLOW.md`                            | ✅       |
| Work on client app              | `apps/client/AGENTS.md`                       | ✅       |
| Work on server API              | `apps/server/AGENTS.md`                       | ✅       |
| Work on shared types/API client | `packages/core/AGENTS.md`                     | ✅       |
| Work on shared UI components    | `packages/ui/AGENTS.md`                       | ❌       |
| Feature example                 | `apps/client/src/features/settings/AGENTS.md` | ✅       |

**Issues:**

- `packages/ui` is not listed in the root navigation table
- `packages/ui/AGENTS.md` does not exist
- Server-level AGENTS.md has its own navigation table (good)

### 3. Single Source of Truth — 6/10

**Duplication found:** Commit conventions appear in both files:

**Root AGENTS.md:**

```
scope: client, server, ui, core, mono, or feature name
```

**CLAUDE.md:**

```
scope: client, ui, core, mono, or feature name
```

CLAUDE.md is **missing `server`** as a scope — a meaningful omission for a
monorepo with a FastAPI backend. This creates confusion: which file is
authoritative?

Additional duplication:

- Architectural boundary rules appear in both CLAUDE.md and root AGENTS.md
- "Features are self-contained" stated in both places

**Recommendation:** CLAUDE.md should reference root AGENTS.md for commit
conventions rather than duplicating them. Add `server` to CLAUDE.md if
keeping both copies.

### 4. Story-to-Code Flow — 9/10

The workflow is mature and well-automated:

```
Story spec (docs/STORIES/) → sync-stories.sh → GitHub Issue + Board
→ Agent reads AGENTS.md chain → Implement on feature branch
→ PR → Self-review → Human review → Merge → Issue → Done
```

ADR-008 documents this workflow. CLAUDE.md section "Story Lifecycle Management"
provides step-by-step instructions with field IDs for board operations. The
`sync-stories.sh` script handles bidirectional sync and archives completed
stories.

**Deduction (-1):** No automated validation that a story spec exists before
branching (relies on convention).

### 5. Date Currency — 5/10

CLAUDE.md mandates: _"Every documentation file must include a `Last updated:
YYYY-MM-DD` line."_

**Compliance audit:**

| File                                          | Has Date? | Date       |
| --------------------------------------------- | --------- | ---------- |
| `CLAUDE.md`                                   | ❌        | —          |
| `AGENTS.md` (root)                            | ❌        | —          |
| `apps/client/AGENTS.md`                       | ✅        | 2026-02-25 |
| `apps/client/src/api/AGENTS.md`               | ✅        | 2026-02-26 |
| `apps/client/src/store/AGENTS.md`             | ❌        | —          |
| `apps/client/src/features/home/AGENTS.md`     | ✅        | 2026-02-26 |
| `apps/client/src/features/pulse/AGENTS.md`    | ✅        | 2026-02-26 |
| `apps/client/src/features/settings/AGENTS.md` | ✅        | 2026-02-25 |
| `apps/server/AGENTS.md`                       | ❌        | —          |
| `apps/server/src/api/AGENTS.md`               | ❌        | —          |
| `apps/server/src/application/AGENTS.md`       | ❌        | —          |
| `apps/server/src/config/AGENTS.md`            | ❌        | —          |
| `apps/server/src/domain/AGENTS.md`            | ❌        | —          |
| `apps/server/src/infrastructure/AGENTS.md`    | ❌        | —          |
| `packages/core/AGENTS.md`                     | ❌        | —          |
| `docs/ARCHITECTURE.md`                        | ✅        | 2026-02-26 |

**Result: 6 of 16 documentation files (38%) have dates.**

CLAUDE.md itself violates its own rule — it mandates dates but doesn't have one.
The entire server-side AGENTS.md chain (6 files) is undated.

### 6. Cross-References — 7/10

**Good cross-references:**

- Root AGENTS.md → ARCHITECTURE.md, WORKFLOW.md
- ADR-007 → AGENTS.md hierarchy explanation
- Feature AGENTS.md files reference parent app AGENTS.md
- CLAUDE.md references root AGENTS.md and the context chain

**Missing cross-references:**

- Server layer AGENTS.md files don't cross-reference each other
- No AGENTS.md ↔ README.md links (because READMEs don't exist yet)
- `.context/CONTEXT-HANDOFF.md` not referenced from CLAUDE.md rules

### 7. Agent-Specific Guidance — 8/10

CLAUDE.md provides clear, actionable rules for Claude Code:

- Decision trees ("When to use Zustand vs React Query")
- Naming conventions table with examples
- Explicit "never" rules (no `any`, no auto-commit, no AI attribution)
- Story lifecycle with exact field IDs for board operations
- Architecture boundary rules with specific import directions

**Deduction (-2):** Some rules are aspirational rather than enforced (testing
mandate with zero tests, error boundary requirement with none implemented).
This creates a gap between documented expectations and reality that could
confuse agents.

### 8. Handoff Continuity — 7/10

`.context/CONTEXT-HANDOFF.md` exists and is well-maintained (~215 lines):

- Presentation context (what this demo is for)
- Tech stack snapshot
- "What's Done" list (5 completed stories)
- "What's NOT Done Yet" backlog
- "How to Resume" instructions

**Issues:**

- CLAUDE.md mentions `.context/` but doesn't formalize handoff rules
- No template for handoff notes
- No rule for when to update CONTEXT-HANDOFF.md (relies on judgment)

### 9. README.md Coverage — Gap

CLAUDE.md states: _"AGENTS.md is for AI agents. Humans need README.md."_

| Location         | README.md Exists? |
| ---------------- | ----------------- |
| `/`              | ✅                |
| `docs/ADR/`      | ✅                |
| `apps/client/`   | ❌                |
| `apps/server/`   | ❌                |
| `packages/core/` | ❌                |
| `packages/ui/`   | ❌                |

Four app/package directories lack human-readable documentation. Agents have
AGENTS.md, but a new human developer has no entry point for these workspaces.

---

## Strengths

1. **Well-codified strategy** — ADR-007 explains the rationale, not just the
   structure. Future maintainers understand _why_ this system exists.

2. **Token efficiency** — ~1,100 tokens total per task is remarkably lean.
   Agents don't waste context on irrelevant documentation.

3. **Story-driven flow** — The spec → sync → board → implement → PR pipeline
   is fully automated and well-documented. AI agents can pick up stories from
   the board autonomously.

4. **Architectural diagrams** — ARCHITECTURE.md has 4 Mermaid diagrams (system
   architecture, database schema, data flow, agent context flow) that render
   on GitHub. These are maintained (dated 2026-02-26).

5. **Feature-level granularity** — Every non-trivial feature has its own
   AGENTS.md with file inventory, data flow, and gotchas. This is the right
   level of detail for task-scoped agent work.

---

## Issues Summary

| #   | Issue                                                  | Severity | Fix Effort |
| --- | ------------------------------------------------------ | -------- | ---------- |
| 1   | 9 of 14 AGENTS.md files missing `Last updated` date    | Medium   | 10 min     |
| 2   | CLAUDE.md missing `Last updated` date (self-violation) | Low      | 1 min      |
| 3   | Commit scope mismatch (CLAUDE.md missing `server`)     | Medium   | 5 min      |
| 4   | Commit conventions duplicated across two files         | Medium   | 15 min     |
| 5   | `packages/ui` missing from root nav table              | Low      | 2 min      |
| 6   | `packages/ui/AGENTS.md` does not exist                 | Low      | 15 min     |
| 7   | No README.md at apps/client, apps/server, packages/\*  | Medium   | 1 hour     |
| 8   | `.context/` handoff rules not formalized in CLAUDE.md  | Low      | 10 min     |
| 9   | ARCHITECTURE.md folder structure stale                 | Medium   | 15 min     |
| 10  | Aspirational rules without implementation (tests)      | High     | Days       |

---

## Comparison to Best Practices

### What This Repo Does Better Than Most

- **Documentation IS the architecture** — Most repos treat docs as an
  afterthought. Here, the AGENTS.md chain IS the architectural specification.
- **Token budget awareness** — The ~1,100 token target shows deliberate design
  for AI consumption, not just human readability.
- **Story lifecycle automation** — Full board integration via `gh` CLI is
  unusually mature for a demo project.
- **ADR discipline** — 10 ADRs documenting architectural decisions. Most
  projects this size have zero.

### Where It Falls Short of Its Own Standards

- **Testing mandate vs reality** — CLAUDE.md has strong testing requirements
  but zero tests exist. This undermines agent trust in the documentation.
- **Date hygiene** — The "Last updated" rule exists but isn't followed
  consistently (38% compliance).
- **Human documentation** — AGENTS.md is excellent for agents but no
  README.md files exist at workspace level for humans.
