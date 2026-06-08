from datetime import datetime, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.lead import Lead
from app.models.appointment import Appointment
from app.models.call_log import CallLog
from app.utils.logger import get_logger

logger = get_logger("analytics_api")
router = APIRouter(prefix="/api/analytics", tags=["Analytics"])


@router.get("/overview")
def get_overview(db: Session = Depends(get_db)):
    today = datetime.utcnow().date()
    return {
        "total_leads": db.query(Lead).count(),
        "total_calls": db.query(CallLog).count(),
        "total_appointments": db.query(Appointment).count(),
        "leads_today": db.query(Lead).filter(func.date(Lead.created_at) == today).count(),
        "calls_today": db.query(CallLog).filter(func.date(CallLog.created_at) == today).count(),
        "appointments_today": db.query(Appointment).filter(func.date(Appointment.created_at) == today).count()
    }


@router.get("/leads")
def get_leads_analytics(db: Session = Depends(get_db)):
    result = {}
    for status in ["new", "qualified", "converted", "lost"]:
        result[status] = db.query(Lead).filter(Lead.status == status).count()
    result["total"] = db.query(Lead).count()
    return result


@router.get("/calls")
def get_calls_analytics(db: Session = Depends(get_db)):
    result = []
    today = datetime.utcnow().date()
    for i in range(6, -1, -1):
        date = today - timedelta(days=i)
        count = db.query(CallLog).filter(func.date(CallLog.created_at) == date).count()
        result.append({"date": str(date), "calls": count})
    return result