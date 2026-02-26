from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.infrastructure.database.connection import Base


class MoodEntryModel(Base):
    __tablename__ = "mood_entries"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    member_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("team_members.id"), index=True
    )
    emoji: Mapped[str] = mapped_column(String(10))
    label: Mapped[str] = mapped_column(String(50))
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True))

    member: Mapped["TeamMemberModel"] = relationship(
        "TeamMemberModel", back_populates="mood_entries"
    )
