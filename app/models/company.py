from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String, nullable=False)
    industry = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    plan = Column(String, default="free")
    status = Column(String, default="active")
    created_at = Column(DateTime, default=datetime.utcnow)