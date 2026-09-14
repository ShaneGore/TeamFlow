"""Database-backed persistence tests: file-backed SQLite behaves like prod."""

import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.config import engine_kwargs
from app.database import Base
from app.repositories import members as member_repo
from app.repositories import tasks as task_repo


def test_sqlite_file_database_persists_and_reloads(tmp_path):
    db_file = tmp_path / "teamflow-persist.db"
    url = f"sqlite:///{db_file}"
    engine = create_engine(url, **engine_kwargs(url))
    Session = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    Base.metadata.create_all(engine)

    db = Session()
    member = member_repo.create_member(db, "Persistent Pam")
    task = task_repo.create_task(
        db,
        title="Persistent task",
        description="Survives session close",
        status="todo",
        priority="low",
        due_date=None,
        label="db",
        assignee_id=member.id,
    )
    task_id = task.id
    member_id = member.id
    db.close()
    engine.dispose()

    reopened = create_engine(url, **engine_kwargs(url))
    ReopenedSession = sessionmaker(bind=reopened, autoflush=False, autocommit=False)
    db2 = ReopenedSession()
    try:
        assert os.path.exists(db_file)
        reloaded = task_repo.get_task(db2, task_id)
        assert reloaded is not None
        assert reloaded.title == "Persistent task"
        assert reloaded.assignee_id == member_id
        assert reloaded.assignee.name == "Persistent Pam"
        assert member_repo.count_tasks_for_member(db2, member_id) == 1
        assert [t.id for t in task_repo.list_tasks(db2)] == [task_id]
    finally:
        db2.close()
        reopened.dispose()


def test_database_url_defaults_to_sqlite_file(monkeypatch):
    from app import config

    monkeypatch.delenv("DATABASE_URL", raising=False)
    assert config.database_url() == "sqlite:///./teamflow.db"
    assert config.engine_kwargs(config.database_url()) == {"connect_args": {"check_same_thread": False}}

    postgres_url = "postgresql+psycopg://user:pass@localhost:5432/teamflow"
    assert config.database_url.__doc__ is not None
    assert config.engine_kwargs(postgres_url) == {}
