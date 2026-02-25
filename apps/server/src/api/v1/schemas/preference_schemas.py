from datetime import datetime

from pydantic import BaseModel, ConfigDict


class PreferenceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: str
    username: str
    dark_mode: bool
    created_at: datetime
    updated_at: datetime


class PreferenceUpdate(BaseModel):
    username: str | None = None
    dark_mode: bool | None = None
