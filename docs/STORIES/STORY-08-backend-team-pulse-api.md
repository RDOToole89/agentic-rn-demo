---
id: STORY-08
title: Backend — Team Pulse API Endpoints
status: backlog
labels: [type:feat, scope:mono]
issue: 10
last_updated: 2026-02-26
---

# STORY-08: Backend — Team Pulse API Endpoints

## Summary

Add Team Pulse API endpoints to the FastAPI backend: list team members, get
member detail with mood history, and submit mood updates. Includes domain
entities, repository pattern, and seed data.

## Context

The frontend Team Pulse feature (STORY-05/06/07) uses mock data. This story
provides the real backend endpoints so the full-stack connection (STORY-09) can
replace mocks with live API calls, completing the demo's end-to-end flow.

## Depends On

- STORY-03 (FastAPI Backend with Hexagonal Architecture)

## Acceptance Criteria

- [ ] `GET /api/v1/team` returns list of team members with current status + mood
- [ ] `GET /api/v1/team/{id}` returns single member with full mood history
- [ ] `POST /api/v1/team/{id}/mood` accepts mood submission (emoji + label)
- [ ] Domain entities: `TeamMember`, `MoodEntry` (pure Python, no framework imports)
- [ ] Repository pattern for all database access
- [ ] Mapper translates between domain models and DB models
- [ ] SQLite persistence (matches STORY-03 pattern)
- [ ] Seed data script creates 6-8 demo team members with mood histories
- [ ] Pydantic schemas for request/response validation
- [ ] AGENTS.md updated with new endpoints
- [ ] All endpoints return proper HTTP status codes and error responses

## Target Structure

```
apps/server/src/
├── api/v1/
│   ├── routes/
│   │   └── team.py                    # Team Pulse route handlers
│   └── schemas/
│       └── team_schemas.py            # Request/response Pydantic models
├── application/services/
│   └── team_service.py                # Use-case orchestration
├── domain/models/
│   ├── team_member.py                 # TeamMember entity
│   └── mood_entry.py                  # MoodEntry value object
├── infrastructure/database/
│   ├── models/
│   │   ├── team_member_model.py       # SQLAlchemy ORM model
│   │   └── mood_entry_model.py        # SQLAlchemy ORM model
│   ├── repositories/
│   │   └── team_repo.py               # CRUD operations
│   └── mappers/
│       └── team_mapper.py             # Domain <-> DB translation
└── seeds/
    └── team_seed.py                   # Demo data seeder
```

## Constraints

- Follow the hexagonal architecture from STORY-03
- Domain layer has zero framework imports
- SQLite only — no PostgreSQL
- No authentication — endpoints are public for the demo
- Seed data should include fun, demo-appropriate names and varied statuses
- Mood history: 3-5 entries per member with realistic timestamps

## Seed Data

6-8 team members with varied statuses and moods:

- Mix of `active`, `away`, `offline` statuses
- Moods: happy, focused, stressed, energized, creative, tired
- Roles: Frontend Dev, Backend Dev, Designer, PM, QA, DevOps

## Files Touched

| File                                                                  | Action | Layer          |
| --------------------------------------------------------------------- | ------ | -------------- |
| `apps/server/src/api/v1/routes/team.py`                               | Create | API            |
| `apps/server/src/api/v1/schemas/team_schemas.py`                      | Create | API            |
| `apps/server/src/application/services/team_service.py`                | Create | Application    |
| `apps/server/src/domain/models/team_member.py`                        | Create | Domain         |
| `apps/server/src/domain/models/mood_entry.py`                         | Create | Domain         |
| `apps/server/src/infrastructure/database/models/team_member_model.py` | Create | Infrastructure |
| `apps/server/src/infrastructure/database/models/mood_entry_model.py`  | Create | Infrastructure |
| `apps/server/src/infrastructure/database/repositories/team_repo.py`   | Create | Infrastructure |
| `apps/server/src/infrastructure/database/mappers/team_mapper.py`      | Create | Infrastructure |
| `apps/server/src/seeds/team_seed.py`                                  | Create | Infrastructure |
| `apps/server/src/api/main.py`                                         | Modify | API            |
| `apps/server/AGENTS.md`                                               | Modify | Docs           |

## Out of Scope

- Authentication / authorization
- WebSocket real-time updates
- File upload for avatars
- Pagination (demo dataset is small)
- Rate limiting
- Kudos as a separate entity (mood submission covers the demo)
