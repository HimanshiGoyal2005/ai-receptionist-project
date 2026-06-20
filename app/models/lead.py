from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from app.database import Base


class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    
    # 🌟 NEW SECURE COLUMNS: Linking the lead strictly to the authenticated user account
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=True)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    requirement = Column(String, nullable=True)
    budget = Column(String, nullable=True)
    timeline = Column(String, nullable=True)
    team_size = Column(String, nullable=True)
    industry = Column(String, nullable=True)
    lead_score = Column(String, nullable=True)
    status = Column(String, default="new")
    source = Column(String, default="voice_call")
    created_at = Column(DateTime, default=datetime.utcnow)