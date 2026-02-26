"""Shared fixtures for all tests."""

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from src.infrastructure.database.connection import Base

# Import all models so they register with Base
import src.infrastructure.database.models.mood_entry_model  # noqa: F401
import src.infrastructure.database.models.preferences_model  # noqa: F401
import src.infrastructure.database.models.team_member_model  # noqa: F401


@pytest.fixture
def db() -> Session:
    """In-memory SQLite session that resets per test."""
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    TestSession = sessionmaker(bind=engine)
    session = TestSession()
    try:
        yield session
    finally:
        session.close()
