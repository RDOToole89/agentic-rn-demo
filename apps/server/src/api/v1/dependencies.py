from collections.abc import Generator

from sqlalchemy.orm import Session

from src.application.services.preferences_service import PreferencesService
from src.application.services.team_service import TeamService
from src.infrastructure.database.connection import SessionLocal
from src.infrastructure.database.repositories.preferences_repo import PreferencesRepository
from src.infrastructure.database.repositories.team_repo import TeamRepository


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_preferences_repo(db: Session) -> PreferencesRepository:
    return PreferencesRepository(db)


def get_preferences_service(repo: PreferencesRepository) -> PreferencesService:
    return PreferencesService(repo)


def get_team_repo(db: Session) -> TeamRepository:
    return TeamRepository(db)


def get_team_service(repo: TeamRepository) -> TeamService:
    return TeamService(repo)
