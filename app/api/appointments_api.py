from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.appointment import Appointment
from app.models.lead import Lead
from app.models.user import User  # 🌟 Imported User model reference
from app.api.auth_api import get_current_user  # 🔒 Imported authentication dependency
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
def create_appointment(
    appointment: AppointmentCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # 🔒 Secured route
):
    # 🌟 Rule 1: Naya appointment banate waqt login user ki team boundaries attach hongi
    db_appt = Appointment(
        **appointment.model_dump(),
        user_id=current_user.id,
        company_id=current_user.company_id
    )
    db.add(db_appt)
    db.commit()
    db.refresh(db_appt)
    
    lead = None
    if db_appt.lead_id:
        lead = db.query(Lead).filter(
            Lead.id == db_appt.lead_id,
            Lead.company_id == current_user.company_id
        ).first()
        
    return build_appointment_response(db_appt, lead)


@router.get("/", response_model=List[AppointmentResponse])
def get_all_appointments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # 🔒 Secured route
):
    # 🌟 Rule 2: Pure database me se sirf current login company ke hi scheduled slots nikalenge
    appointments = db.query(Appointment).filter(
        Appointment.company_id == current_user.company_id
    ).all()
    
    result = []
    for appt in appointments:
        lead = None
        if appt.lead_id:
            lead = db.query(Lead).filter(
                Lead.id == appt.lead_id,
                Lead.company_id == current_user.company_id
            ).first()
        result.append(build_appointment_response(appt, lead))
    return result


@router.put("/{appt_id}", response_model=AppointmentResponse)
def update_appointment(
    appt_id: int, 
    status: str, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # 🔒 Secured route
):
    # 🌟 Rule 3: Kisi scheduled slot ka status badalte waqt cross-company injection verify hoga
    appt = db.query(Appointment).filter(
        Appointment.id == appt_id,
        Appointment.company_id == current_user.company_id
    ).first()
    
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found or unauthorized access")
        
    appt.status = status
    db.commit()
    db.refresh(appt)
    
    lead = None
    if appt.lead_id:
        lead = db.query(Lead).filter(
            Lead.id == appt.lead_id,
            Lead.company_id == current_user.company_id
        ).first()
    return build_appointment_response(appt, lead)


@router.delete("/{appt_id}")
def delete_appointment(
    appt_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # 🔒 Secured route
):
    # 🌟 Rule 4: Slot delete/cancel karte waqt strict tenant clearance check
    appt = db.query(Appointment).filter(
        Appointment.id == appt_id,
        Appointment.company_id == current_user.company_id
    ).first()
    
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found or unauthorized access")
        
    db.delete(appt)
    db.commit()
    return {"message": "Appointment cancelled successfully"}