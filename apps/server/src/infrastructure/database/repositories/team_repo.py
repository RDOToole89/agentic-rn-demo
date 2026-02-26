from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from src.domain.models.mood_entry import MoodEntry
from src.domain.models.team_member import TeamMember
from src.infrastructure.database.mappers.team_mapper import (
    mood_entry_to_domain,
    mood_entry_to_model,
    team_member_to_domain,
    team_member_to_model,
)
from src.infrastructure.database.models.mood_entry_model import MoodEntryModel
from src.infrastructure.database.models.team_member_model import TeamMemberModel


class TeamRepository:
    def __init__(self, db: Session) -> None:
        self._db = db

    def get_all(self) -> list[TeamMember]:
        stmt = select(TeamMemberModel).options(
            selectinload(TeamMemberModel.mood_entries)
        )
        models = self._db.scalars(stmt).unique().all()
        return [team_member_to_domain(m) for m in models]

    def get_by_id(self, member_id: str) -> TeamMember | None:
        stmt = (
            select(TeamMemberModel)
            .where(TeamMemberModel.id == member_id)
            .options(selectinload(TeamMemberModel.mood_entries))
        )
        model = self._db.scalars(stmt).first()
        if model is None:
            return None
        return team_member_to_domain(model)

    def add_mood_entry(self, entry: MoodEntry) -> MoodEntry:
        model = mood_entry_to_model(entry)
        self._db.add(model)
        self._db.commit()
        self._db.refresh(model)
        return mood_entry_to_domain(model)

    def save_member(self, member: TeamMember) -> TeamMember:
        model = team_member_to_model(member)
        self._db.merge(model)
        self._db.commit()
        return member

    def count(self) -> int:
        stmt = select(func.count()).select_from(TeamMemberModel)
        return self._db.scalar(stmt) or 0
