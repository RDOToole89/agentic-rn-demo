from datetime import datetime

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class MoodEntryResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
        alias_generator=to_camel,
        populate_by_name=True,
    )

    emoji: str
    label: str
    timestamp: datetime


class TeamMemberResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
        alias_generator=to_camel,
        populate_by_name=True,
    )

    id: str
    name: str
    role: str
    avatar_url: str | None
    status: str
    current_mood: MoodEntryResponse | None
    mood_history: list[MoodEntryResponse]


class SubmitMoodRequest(BaseModel):
    emoji: str
    label: str
