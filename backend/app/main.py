"""FastAPI application factory for TeamFlow."""

from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import models  # noqa: F401  (register tables on Base.metadata)
from app.config import frontend_origins
from app.database import init_db
from app.errors import register_error_handlers
from app.routers import members, tasks


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    yield


def create_app() -> FastAPI:
    app = FastAPI(title="TeamFlow API", version="0.1.0", lifespan=lifespan)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=frontend_origins(),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    register_error_handlers(app)

    @app.get("/api/health", tags=["Health"])
    def health() -> dict[str, str]:
        return {"status": "ok"}

    app.include_router(tasks.router)
    app.include_router(members.router)

    return app


app = create_app()
