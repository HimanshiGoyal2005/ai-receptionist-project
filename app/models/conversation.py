from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from app.database import Base


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id"), nullable=True)
    call_id = Column(String, nullable=True)
    transcript = Column(Text, nullable=True)
    ai_summary = Column(Text, nullable=True)
    intent = Column(String, nullable=True)
    sentiment = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)