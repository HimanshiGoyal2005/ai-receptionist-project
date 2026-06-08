from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class CallCreate(BaseModel):
    company_id: Optional[int] = None
    lead_id: Optional[int] = None
    call_duration: Optional[int] = None
    recording_url: Optional[str] = None
    status: Optional[str] = "completed"


class CallResponse(BaseModel):
    id: int
    company_id: Optional[int]
    lead_id: Optional[int]
    call_duration: Optional[int]
    recording_url: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True