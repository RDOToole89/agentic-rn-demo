from collections.abc import Generator

from sqlalchemy.orm import Session

from src.application.services.preferences_service import PreferencesService
from src.infrastructure.database.connection import SessionLocal
from src.infrastructure.database.repositories.preferences_repo import PreferencesRepository


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
