"""Task router: CRUD plus PATCH status for board moves."""

from __future__ import annotations

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.repositories import tasks as task_repo
from app.schemas.task import StatusUpdate, TaskCreate, TaskRead, TaskStatus, TaskUpdate
from app.services import ensure_assignee_exists, get_task_or_404, task_to_read

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])


@router.get("", response_model=list[TaskRead])
def list_tasks(
    db: Session = Depends(get_db),
    status_filter: TaskStatus | None = Query(default=None, alias="status"),
    assignee_id: int | None = Query(default=None, ge=1),
) -> list[TaskRead]:
    tasks = task_repo.list_tasks(db, status=status_filter, assignee_id=assignee_id)
    return [task_to_read(task) for task in tasks]


@router.post("", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(payload: TaskCreate, db: Session = Depends(get_db)) -> TaskRead:
    ensure_assignee_exists(db, payload.assignee_id)
    task = task_repo.create_task(
        db,
        title=payload.title,
        description=payload.description,
        status=payload.status,
        priority=payload.priority,
        due_date=payload.due_date,
        label=payload.label,
        assignee_id=payload.assignee_id,
    )
    return task_to_read(task)


@router.get("/{task_id}", response_model=TaskRead)
def get_task(task_id: int, db: Session = Depends(get_db)) -> TaskRead:
    return task_to_read(get_task_or_404(db, task_id))


@router.put("/{task_id}", response_model=TaskRead)
def update_task(task_id: int, payload: TaskUpdate, db: Session = Depends(get_db)) -> TaskRead:
    task = get_task_or_404(db, task_id)
    data = payload.model_dump(exclude_unset=True)
    if "assignee_id" in data:
        ensure_assignee_exists(db, data["assignee_id"])
    for field, value in data.items():
        setattr(task, field, value)
    return task_to_read(task_repo.save_task(db, task))


@router.patch("/{task_id}/status", response_model=TaskRead)
def update_task_status(task_id: int, payload: StatusUpdate, db: Session = Depends(get_db)) -> TaskRead:
    task = get_task_or_404(db, task_id)
    task.status = payload.status
    return task_to_read(task_repo.save_task(db, task))


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: Session = Depends(get_db)) -> Response:
    task = get_task_or_404(db, task_id)
    task_repo.delete_task(db, task)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
