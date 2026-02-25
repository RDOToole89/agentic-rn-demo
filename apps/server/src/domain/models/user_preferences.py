from dataclasses import dataclass
from datetime import datetime, timezone


@dataclass
class UserPreferences:
    user_id: str
    username: str
    dark_mode: bool
    created_at: datetime
    updated_at: datetime


def create_default_preferences(user_id: str) -> UserPreferences:
    now = datetime.now(timezone.utc)
    return UserPreferences(
        user_id=user_id,
        username="Guest",
        dark_mode=False,
        created_at=now,
        updated_at=now,
    )
