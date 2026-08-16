from app.models.profile import Profile


def create_profile(db, profile, user_id):
    existing = db.query(Profile).filter(Profile.user_id == user_id).first()
    if existing:
        return {"success": False, "message": "Profile already exists"}

    profile_data = profile.model_dump(exclude_unset=True)
    db_profile = Profile(user_id=user_id, **profile_data)
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)

    return {
        "success": True,
        "message": "Profile created successfully",
        "data": db_profile,
    }


def update_profile(db, profile, user_id):
    db_profile = db.query(Profile).filter(Profile.user_id == user_id).first()

    if not db_profile:
        return {"message": "Profile not found"}

    profile_data = profile.model_dump(exclude_unset=True)
    for key, value in profile_data.items():
        setattr(db_profile, key, value)

    db.commit()
    db.refresh(db_profile)

    return db_profile
