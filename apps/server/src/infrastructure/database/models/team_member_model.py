from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.infrastructure.database.connection import Base


class TeamMemberModel(Base):
    __tablename__ = "team_members"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    role: Mapped[str] = mapped_column(String(100))
    avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="active")

    mood_entries: Mapped[list["MoodEntryModel"]] = relationship(
        "MoodEntryModel",
        back_populates="member",
        cascade="all, delete-orphan",
        order_by="desc(MoodEntryModel.timestamp)",
    )
