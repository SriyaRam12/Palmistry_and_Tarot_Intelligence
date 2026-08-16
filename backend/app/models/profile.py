from sqlalchemy import Column, Integer, String, ForeignKey
from app.database.connection import Base


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    age_group = Column(String(50))
    interests = Column(String(255))
    spiritual_goals = Column(String(255))
    reading_preferences = Column(String(255))
    bio = Column(String(500))
    preferred_language = Column(String(50), default="English")
    profile_picture = Column(String(255), nullable=True)
    avatar = Column(String(100), nullable=True, default="female-1")

    