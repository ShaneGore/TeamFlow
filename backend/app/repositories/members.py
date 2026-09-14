"""Team-member repository: all TeamMember SQLAlchemy access lives here."""

from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.task import Task
from app.models.team_member import TeamMember


def list_members(db: Session) -> list[TeamMember]:
    return list(db.scalars(select(TeamMember).order_by(TeamMember.id)).all())


def get_member(db: Session, member_id: int) -> TeamMember | None:
    return db.get(TeamMember, member_id)


def find_by_name_ci(db: Session, name: str) -> TeamMember | None:
    return db.scalar(select(TeamMember).where(func.lower(TeamMember.name) == name.lower()))


def create_member(db: Session, name: str) -> TeamMember:
    member = TeamMember(name=name)
    db.add(member)
    db.commit()
    db.refresh(member)
    return member


def delete_member(db: Session, member: TeamMember) -> None:
    db.delete(member)
    db.commit()


def count_tasks_for_member(db: Session, member_id: int) -> int:
    return db.scalar(select(func.count()).select_from(Task).where(Task.assignee_id == member_id)) or 0
