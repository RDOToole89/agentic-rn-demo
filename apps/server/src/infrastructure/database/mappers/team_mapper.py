from src.domain.models.mood_entry import MoodEntry
from src.domain.models.team_member import TeamMember
from src.infrastructure.database.models.mood_entry_model import MoodEntryModel
from src.infrastructure.database.models.team_member_model import TeamMemberModel


def mood_entry_to_domain(model: MoodEntryModel) -> MoodEntry:
    return MoodEntry(
        id=model.id,
        member_id=model.member_id,
        emoji=model.emoji,
        label=model.label,
        timestamp=model.timestamp,
    )


def mood_entry_to_model(entry: MoodEntry) -> MoodEntryModel:
    return MoodEntryModel(
        id=entry.id,
        member_id=entry.member_id,
        emoji=entry.emoji,
        label=entry.label,
        timestamp=entry.timestamp,
    )


def team_member_to_domain(model: TeamMemberModel) -> TeamMember:
    return TeamMember(
        id=model.id,
        name=model.name,
        role=model.role,
        avatar_url=model.avatar_url,
        status=model.status,
        mood_entries=[mood_entry_to_domain(e) for e in model.mood_entries],
    )


def team_member_to_model(entity: TeamMember) -> TeamMemberModel:
    return TeamMemberModel(
        id=entity.id,
        name=entity.name,
        role=entity.role,
        avatar_url=entity.avatar_url,
        status=entity.status,
        mood_entries=[mood_entry_to_model(e) for e in entity.mood_entries],
    )
