# ADR-010: Hexagonal Architecture for FastAPI Backend

**Status**: Accepted

## Context

The monorepo needed a backend API to serve the client app. The client already
uses a layered architecture (ADR-003) with strict boundaries: pure domain,
service interfaces, feature modules. The backend needed a complementary pattern
that mirrors these principles in Python while being independently swappable
at every layer.

Key requirements:
- Domain logic must be pure Python with zero framework imports
- Database should be swappable (SQLite for dev, PostgreSQL for prod) without
  touching business logic
- HTTP framework should be replaceable without rewriting the core
- AI agents must know exactly where to place new code
- Schema drift between client TypeScript and server Python must be detectable

## Decision

Adopt **hexagonal architecture** (ports & adapters) with five layers:

```
src/api/              → Inbound adapter (FastAPI routes, Pydantic schemas, DI)
src/application/      → Use-case orchestration (thin services)
src/domain/           → Pure business logic (dataclasses, validation)
src/infrastructure/   → Outbound adapter (SQLAlchemy ORM, repositories, mappers)
src/config/           → Settings (pydantic-settings from .env)
```

**Dependency rule**: Domain depends on nothing. Application depends on domain
and infrastructure. API depends on application. Infrastructure depends on
domain (for entity types) and config (for connection strings).

**DI wiring** via FastAPI `Depends()`:

```
Route handler → service = Depends(get_service)
                  → repo = Depends(get_repo)
                      → db = Depends(get_db) → SessionLocal()
```

**Mapper pattern** for domain-infrastructure boundary: explicit `to_domain()`
and `to_model()` functions that do field-by-field mapping. If a field is added
to one side but not the other, the mapper fails with `TypeError` at runtime —
the canary for schema drift.

## Alternatives Considered

### Flat FastAPI structure (routes + models + db)
Simpler, fewer files. Rejected because it doesn't demonstrate the architectural
pattern we're teaching, and domain logic becomes entangled with framework code.

### Django with apps
Full-featured, batteries-included. Rejected because the ORM is tightly coupled
to the framework (domain can't be pure), and it's heavier than needed for a
demo backend.

### Clean Architecture (Uncle Bob)
Very similar to hexagonal but adds more layers (entities, use-cases, interface
adapters, frameworks). Rejected as over-engineered for a single-entity demo —
hexagonal gives the same boundary guarantees with less boilerplate.

## Consequences

- **Positive**: Domain is testable in isolation — no mocks needed for pure
  dataclasses and validation functions
- **Positive**: Database swappable by changing `DATABASE_URL` — no code changes
  required (SQLite → PostgreSQL)
- **Positive**: Mappers catch schema drift at runtime — adding a field to the
  domain without updating the ORM model causes an immediate `TypeError`
- **Positive**: AGENTS.md at each layer gives agents a decision tree for code
  placement, mirroring the client's progressive disclosure pattern
- **Positive**: Client and server share the same architectural philosophy —
  consistent mental model for the demo
- **Negative**: More files for simple operations (~30 files for one entity)
- **Negative**: Mapper boilerplate for every entity (field-by-field copying)
- **Negative**: Five layers is a lot for a single-entity demo (intentional —
  demonstrates the pattern at scale)
