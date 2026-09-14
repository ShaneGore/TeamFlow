"""Environment configuration: database URL and frontend CORS origins."""

from __future__ import annotations

import os


def database_url() -> str:
    """Default is a local SQLite file. Replace with any SQLAlchemy URL later."""
    return os.getenv("DATABASE_URL", "sqlite:///./teamflow.db")


def engine_kwargs(url: str) -> dict:
    """Only SQLite needs thread-check disabled; other drivers stay portable."""
    if url.startswith("sqlite"):
        return {"connect_args": {"check_same_thread": False}}
    return {}


def frontend_origins() -> list[str]:
    raw = os.getenv("FRONTEND_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
    return [origin.strip() for origin in raw.split(",") if origin.strip()]
