from contextlib import asynccontextmanager
from collections.abc import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.v1.routes import health, preferences, team
from src.config.settings import settings
from src.infrastructure.database.connection import SessionLocal, create_tables
from src.seeds.team_seed import seed_team_data


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncGenerator[None, None]:
    create_tables()
    db = SessionLocal()
    try:
        seed_team_data(db)
    finally:
        db.close()
    yield


app = FastAPI(title="agentic-rn-demo API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(preferences.router)
app.include_router(team.router)
