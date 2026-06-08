from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.appointment import Appointment
from app.schemas.appointment_schema import AppointmentCreate, AppointmentResponse

router = APIRouter(prefix="/api/appointments", tags=["Appointments"])


@router.post("/", response_model=AppointmentResponse)
def create_appointment(appointment: AppointmentCreate, db: Session = Depends(get_db)):
    db_appt = Appointment(**appointment.model_dump())
    db.add(db_appt)
    db.commit()
    db.refresh(db_appt)
    return db_appt


@router.get("/", response_model=List[AppointmentResponse])
def get_all_appointments(db: Session = Depends(get_db)):
    return db.query(Appointment).all()


@router.put("/{appt_id}", response_model=AppointmentResponse)
def update_appointment(appt_id: int, status: str, db: Session = Depends(get_db)):
    appt = db.query(Appointment).filter(Appointment.id == appt_id).first()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    appt.status = status
    db.commit()
    db.refresh(appt)
    return appt


@router.delete("/{appt_id}")
def delete_appointment(appt_id: int, db: Session = Depends(get_db)):
    appt = db.query(Appointment).filter(Appointment.id == appt_id).first()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    db.delete(appt)
    db.commit()
    return {"message": "Appointment cancelled successfully"}