from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class AppointmentCreate(BaseModel):
    lead_id: Optional[int] = None
    appointment_date: str
    appointment_time: str
    status: Optional[str] = "scheduled"


class AppointmentResponse(BaseModel):
    id: int
    lead_id: Optional[int]
    lead_name: Optional[str] = None
    lead_phone: Optional[str] = None
    appointment_date: str
    appointment_time: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True