from datetime import datetime
from pydantic import BaseModel


class ProfileCreate(BaseModel):
    age_group: str | None = None
    interests: str | None = None
    spiritual_goals: str | None = None
    reading_preferences: str | None = None
    bio: str | None = None
    preferred_language: str | None = None
    avatar: str | None = None


class ProfileUpdate(ProfileCreate):
    full_name: str | None = None


class ProfileResponse(ProfileCreate):
    id: int
    user_id: int
    full_name: str | None = None
    email: str | None = None
    role: str | None = None
    created_at: datetime | None = None
    profile_picture: str | None = None

    class Config:
        from_attributes = True