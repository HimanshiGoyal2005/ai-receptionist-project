from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.appointment import Appointment
from app.models.lead import Lead
from app.schemas.appointment_schema import AppointmentCreate, AppointmentResponse

router = APIRouter(prefix="/api/appointments", tags=["Appointments"])


def build_appointment_response(appt: Appointment, lead: Lead | None = None):
    return {
        "id": appt.id,
        "lead_id": appt.lead_id,
        "lead_name": lead.name if lead else None,
        "lead_phone": lead.phone if lead else None,
        "appointment_date": appt.appointment_date,
        "appointment_time": appt.appointment_time,
        "status": appt.status,
        "created_at": appt.created_at,
    }


@router.post("/", response_model=AppointmentResponse)
def create_appointment(appointment: AppointmentCreate, db: Session = Depends(get_db)):
    db_appt = Appointment(**appointment.model_dump())
    db.add(db_appt)
    db.commit()
    db.refresh(db_appt)
    lead = None
    if db_appt.lead_id:
        lead = db.query(Lead).filter(Lead.id == db_appt.lead_id).first()
    return build_appointment_response(db_appt, lead)


@router.get("/", response_model=List[AppointmentResponse])
def get_all_appointments(db: Session = Depends(get_db)):
    appointments = db.query(Appointment).all()
    result = []
    for appt in appointments:
        lead = None
        if appt.lead_id:
            lead = db.query(Lead).filter(Lead.id == appt.lead_id).first()
        result.append(build_appointment_response(appt, lead))
    return result


@router.put("/{appt_id}", response_model=AppointmentResponse)
def update_appointment(appt_id: int, status: str, db: Session = Depends(get_db)):
    appt = db.query(Appointment).filter(Appointment.id == appt_id).first()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    appt.status = status
    db.commit()
    db.refresh(appt)
    lead = None
    if appt.lead_id:
        lead = db.query(Lead).filter(Lead.id == appt.lead_id).first()
    return build_appointment_response(appt, lead)


@router.delete("/{appt_id}")
def delete_appointment(appt_id: int, db: Session = Depends(get_db)):
    appt = db.query(Appointment).filter(Appointment.id == appt_id).first()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    db.delete(appt)
    db.commit()
    return {"message": "Appointment cancelled successfully"}