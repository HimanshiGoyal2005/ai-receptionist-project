from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.conversation import Conversation
from app.models.lead import Lead
from app.utils.logger import get_logger

logger = get_logger("conversations_api")
router = APIRouter(prefix="/api/conversations", tags=["Conversations"])


@router.get("")
def get_conversations(lead_id: int | None = Query(None), db: Session = Depends(get_db)):
    query = db.query(Conversation, Lead).outerjoin(Lead, Conversation.lead_id == Lead.id)
    if lead_id is not None:
        query = query.filter(Conversation.lead_id == lead_id)

    conversations = query.order_by(Conversation.created_at.desc()).all()

    result = []
    for conv, lead in conversations:
        result.append({
            "id": conv.id,
            "lead": lead.name if lead else None,
            "phone": lead.phone if lead else None,
            "lead_id": lead.id if lead else conv.lead_id,
            "intent": conv.intent,
            "sentiment": conv.sentiment,
            "date": conv.created_at.strftime("%Y-%m-%d %I:%M %p") if conv.created_at else None,
            "transcript": conv.transcript,
            "ai_summary": conv.ai_summary,
        })

    logger.info(f"Returned {len(result)} conversations")
    return result
