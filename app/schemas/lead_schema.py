from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class LeadCreate(BaseModel):
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    requirement: Optional[str] = None
    budget: Optional[str] = None
    timeline: Optional[str] = None
    team_size: Optional[str] = None
    industry: Optional[str] = None
    lead_score: Optional[str] = None
    status: Optional[str] = "new"
    source: Optional[str] = "voice_call"
    company_id: Optional[int] = None


class LeadUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    requirement: Optional[str] = None
    budget: Optional[str] = None
    timeline: Optional[str] = None
    team_size: Optional[str] = None
    industry: Optional[str] = None
    lead_score: Optional[str] = None
    status: Optional[str] = None


class LeadResponse(BaseModel):
    id: int
    name: str
    phone: Optional[str]
    email: Optional[str]
    requirement: Optional[str]
    budget: Optional[str]
    timeline: Optional[str]
    team_size: Optional[str]
    industry: Optional[str]
    lead_score: Optional[str]
    status: str
    source: str
    company_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True