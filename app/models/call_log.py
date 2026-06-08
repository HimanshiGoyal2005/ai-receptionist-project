from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from app.database import Base


class CallLog(Base):
    __tablename__ = "call_logs"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=True)
    lead_id = Column(Integer, ForeignKey("leads.id"), nullable=True)
    call_duration = Column(Integer, nullable=True)
    recording_url = Column(String, nullable=True)
    status = Column(String, default="completed")
    created_at = Column(DateTime, default=datetime.utcnow)