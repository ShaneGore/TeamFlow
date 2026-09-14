"""Team-member router: create/list plus guarded delete (409 if assigned)."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.repositories import members as member_repo
from app.schemas.team_member import TeamMemberCreate, TeamMemberRead

router = APIRouter(prefix="/api/team-members", tags=["Team members"])


@router.get("", response_model=list[TeamMemberRead])
def list_members(db: Session = Depends(get_db)) -> list[TeamMemberRead]:
    members = member_repo.list_members(db)
    return [TeamMemberRead(id=m.id, name=m.name, created_at=m.created_at) for m in members]


@router.post("", response_model=TeamMemberRead, status_code=status.HTTP_201_CREATED)
def create_member(payload: TeamMemberCreate, db: Session = Depends(get_db)) -> TeamMemberRead:
    if member_repo.find_by_name_ci(db, payload.name) is not None:
        raise HTTPException(
            status_code=409,
            detail={
                "message": f'Team member "{payload.name}" already exists.',
                "details": {"name": "This name is already taken."},
            },
        )
    member = member_repo.create_member(db, payload.name)
    return TeamMemberRead(id=member.id, name=member.name, created_at=member.created_at)


@router.delete("/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_member(member_id: int, db: Session = Depends(get_db)) -> Response:
    member = member_repo.get_member(db, member_id)
    if member is None:
        raise HTTPException(status_code=404, detail={"message": "Team member not found.", "details": None})
    assigned = member_repo.count_tasks_for_member(db, member_id)
    if assigned:
        raise HTTPException(
            status_code=409,
            detail={
                "message": (
                    f"Cannot delete {member.name} because {assigned} task(s) are still assigned to them. "
                    "Reassign or unassign those tasks first."
                ),
                "details": None,
            },
        )
    member_repo.delete_member(db, member)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
