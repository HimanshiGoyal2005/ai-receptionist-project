from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from app.database import Base


class Appointment(Base):
    __tablename__ = "appointments"
    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False) # Add this
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False) # Add this
    appointment_date = Column(String, nullable=True)
    appointment_time = Column(String, nullable=True)
    status = Column(String, default="scheduled")
    created_at = Column(DateTime, default=datetime.utcnow)