from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from src.config.settings import settings


engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def create_tables() -> None:
    # Import model so ORM registers it with Base before creating tables
    import src.infrastructure.database.models.preferences_model  # noqa: F401

    Base.metadata.create_all(bind=engine)
