"""Pydantic team-member schemas mirroring openapi.yaml components."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field, field_validator


class TeamMemberCreate(BaseModel):
    name: str = Field(min_length=1, max_length=80)

    @field_validator("name")
    @classmethod
    def name_not_blank(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("Team member name is required.")
        return cleaned


class TeamMemberRead(BaseModel):
    id: int
    name: str
    created_at: datetime
