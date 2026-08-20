from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routers import tarot
from app.api.routes import router
from app.api.auth import router as auth_router
from app.api.profile import router as profile_router
from app.api.palm import router as palm_router
from app.api.admin import router as admin_router
from app.api.dashboard import router as dashboard_router
from app.api.report import router as report_router

app = FastAPI(
    title="Palmistry & Tarot Intelligence Platform API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "https://palmistry-tarot-frontend-t26e.onrender.com",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
print("=" * 50)
print("UPLOAD_FOLDER:", os.path.abspath(UPLOAD_FOLDER))
print("CURRENT WORKING DIRECTORY:", os.getcwd())

for root, dirs, files in os.walk(os.getcwd()):
    if os.path.basename(root) == "uploads":
        print("FOUND UPLOADS FOLDER:", root)
        print("FILES:", files)

print("=" * 50)
app.mount(
    "/uploads",
    StaticFiles(directory=UPLOAD_FOLDER),
    name="uploads"
)
app.include_router(router)
app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(palm_router)
app.include_router(admin_router)
app.include_router(dashboard_router)
app.include_router(report_router)
app.include_router(tarot.router)