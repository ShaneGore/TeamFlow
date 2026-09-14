"""Task repository: all Task SQLAlchemy access lives here."""

from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.task import Task


def list_tasks(db: Session, *, status: str | None = None, assignee_id: int | None = None) -> list[Task]:
    query = select(Task).order_by(Task.id)
    if status is not None:
        query = query.where(Task.status == status)
    if assignee_id is not None:
        query = query.where(Task.assignee_id == assignee_id)
    return list(db.scalars(query).all())


def get_task(db: Session, task_id: int) -> Task | None:
    return db.get(Task, task_id)


def create_task(db: Session, **fields) -> Task:
    task = Task(**fields)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def save_task(db: Session, task: Task) -> Task:
    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task: Task) -> None:
    db.delete(task)
    db.commit()


def count_tasks_for_member(db: Session, member_id: int) -> int:
    return db.scalar(select(Task.id).where(Task.assignee_id == member_id).limit(1)) is not None
