"""Business rules shared by routers: lookup, serialization, assignee checks."""

from __future__ import annotations

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.task import Task
from app.models.team_member import TeamMember
from app.repositories import tasks as task_repo
from app.repositories.members import get_member
from app.schemas.task import TaskRead


def task_to_read(task: Task) -> TaskRead:
    return TaskRead(
        id=task.id,
        title=task.title,
        description=task.description or "",
        status=task.status,
        priority=task.priority,
        due_date=task.due_date,
        label=task.label or "",
        assignee_id=task.assignee_id,
        assignee_name=task.assignee.name if task.assignee else None,
        created_at=task.created_at,
        updated_at=task.updated_at,
    )


def get_task_or_404(db: Session, task_id: int) -> Task:
    task = task_repo.get_task(db, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail={"message": "Task not found.", "details": None})
    return task


def ensure_assignee_exists(db: Session, assignee_id: int | None) -> TeamMember | None:
    if assignee_id is None:
        return None
    member = get_member(db, assignee_id)
    if member is None:
        raise HTTPException(
            status_code=422,
            detail={"message": "Selected team member does not exist.", "details": {"assignee_id": "Unknown team member."}},
        )
    return member
