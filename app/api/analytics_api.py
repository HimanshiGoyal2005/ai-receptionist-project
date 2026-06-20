from datetime import datetime, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.lead import Lead
from app.models.appointment import Appointment
from app.models.call_log import CallLog
from app.models.user import User # 🌟 Imported User
from app.api.auth_api import get_current_user # 🔒 Imported Auth
from app.utils.logger import get_logger

logger = get_logger("analytics_api")
router = APIRouter(prefix="/api/analytics", tags=["Analytics"])


@router.get("/overview")
def get_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user) # 🔒 Secured route
):
    today = datetime.utcnow().date()
    # 🌟 Rule: Har count sirf current_user ki company_id par filtered hoga
    company_id = current_user.company_id
    
    return {
        "total_leads": db.query(Lead).filter(Lead.company_id == company_id).count(),
        "total_calls": db.query(CallLog).filter(CallLog.company_id == company_id).count(),
        "total_appointments": db.query(Appointment).filter(Appointment.company_id == company_id).count(),
        
        "leads_today": db.query(Lead).filter(
            Lead.company_id == company_id, 
            func.date(Lead.created_at) == today
        ).count(),
        "calls_today": db.query(CallLog).filter(
            CallLog.company_id == company_id, 
            func.date(CallLog.created_at) == today
        ).count(),
        "appointments_today": db.query(Appointment).filter(
            Appointment.company_id == company_id, 
            func.date(Appointment.created_at) == today
        ).count()
    }


@router.get("/leads")
def get_leads_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user) # 🔒 Secured route
):
    result = {}
    company_id = current_user.company_id
    
    for status in ["new", "qualified", "converted", "lost"]:
        result[status] = db.query(Lead).filter(
            Lead.company_id == company_id, 
            Lead.status == status
        ).count()
        
    result["total"] = db.query(Lead).filter(Lead.company_id == company_id).count()
    return result


@router.get("/calls")
def get_calls_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user) # 🔒 Secured route
):
    result = []
    today = datetime.utcnow().date()
    company_id = current_user.company_id
    
    for i in range(6, -1, -1):
        date = today - timedelta(days=i)
        count = db.query(CallLog).filter(
            CallLog.company_id == company_id, 
            func.date(CallLog.created_at) == date
        ).count()
        result.append({"date": str(date), "calls": count})
    return result