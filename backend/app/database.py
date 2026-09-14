"""Database-agnostic session layer.

SQLite is the beginner-friendly default database. Any SQLAlchemy-supported
DATABASE_URL can replace it without changing application code.
"""

from __future__ import annotations

from collections.abc import Iterator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import database_url, engine_kwargs


class Base(DeclarativeBase):
    pass


_engine = create_engine(database_url(), **engine_kwargs(database_url()))
SessionLocal = sessionmaker(bind=_engine, autoflush=False, autocommit=False)


def init_db() -> None:
    """Create tables if needed. Beginner-friendly alternative to migrations."""
    from app import models  # noqa: F401  (register tables)

    Base.metadata.create_all(bind=_engine)


def get_db() -> Iterator[Session]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
