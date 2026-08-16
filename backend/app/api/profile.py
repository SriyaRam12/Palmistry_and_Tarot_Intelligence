from fastapi import APIRouter, Depends
from sqlalchemy import inspect, text
from sqlalchemy.orm import Session

from app.database.connection import Base, get_db
from app.models.profile import Profile
from app.models.user import User
from app.schemas.profile import ProfileCreate, ProfileUpdate
from app.services.profile_service import create_profile
from app.core.dependencies import get_current_user

router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)


def _ensure_profile_columns(db: Session) -> None:
    try:
        inspector = inspect(db.get_bind())
        if not inspector.has_table("profiles"):
            Base.metadata.create_all(bind=db.get_bind())
            return
        columns = {column["name"] for column in inspector.get_columns("profiles")}
        if "avatar" not in columns:
            db.execute(text("ALTER TABLE profiles ADD COLUMN avatar VARCHAR(100)"))
            db.commit()
    except Exception:
        db.rollback()


@router.post("/")
def create_user_profile(
    profile: ProfileCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return create_profile(db, profile, current_user.id)


@router.get("/")
def get_profile(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    _ensure_profile_columns(db)
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()

    if not profile:
        return {"message": "Profile not found"}

    return {
        "id": profile.id,
        "user_id": profile.user_id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "role": current_user.role,
        "created_at": current_user.created_at,
        "age_group": profile.age_group,
        "interests": profile.interests,
        "spiritual_goals": profile.spiritual_goals,
        "reading_preferences": profile.reading_preferences,
        "bio": profile.bio,
        "preferred_language": profile.preferred_language,
        "profile_picture": profile.profile_picture,
        "avatar": profile.avatar,
    }


@router.put("/")
def update_profile(
    profile: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    _ensure_profile_columns(db)

    db_profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not db_profile:
        db_profile = Profile(user_id=current_user.id)
        db.add(db_profile)

    update_data = profile.model_dump(exclude_unset=True)
    if "full_name" in update_data and update_data["full_name"] is not None:
        current_user.full_name = update_data["full_name"]
        db.add(current_user)
        update_data.pop("full_name")

    for key, value in update_data.items():
        if hasattr(db_profile, key):
            setattr(db_profile, key, value)

    db.commit()
    db.refresh(db_profile)
    db.refresh(current_user)

    return {
        "id": db_profile.id,
        "user_id": db_profile.user_id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "role": current_user.role,
        "created_at": current_user.created_at,
        "age_group": db_profile.age_group,
        "interests": db_profile.interests,
        "spiritual_goals": db_profile.spiritual_goals,
        "reading_preferences": db_profile.reading_preferences,
        "bio": db_profile.bio,
        "preferred_language": db_profile.preferred_language,
        "profile_picture": db_profile.profile_picture,
        "avatar": db_profile.avatar,
    }