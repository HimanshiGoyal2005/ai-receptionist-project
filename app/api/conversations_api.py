from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.conversation import Conversation
from app.models.lead import Lead
from app.utils.logger import get_logger

logger = get_logger("conversations_api")
router = APIRouter(prefix="/api/conversations", tags=["Conversations"])


@router.get("")
def get_conversations(db: Session = Depends(get_db)):
    conversations = (
        db.query(Conversation, Lead)
        .outerjoin(Lead, Conversation.lead_id == Lead.id)
        .order_by(Conversation.created_at.desc())
        .all()
    )

    result = []
    for conv, lead in conversations:
        result.append({
            "id": conv.id,
            "lead": lead.name if lead else None,
            "phone": lead.phone if lead else None,
            "intent": conv.intent,
            "sentiment": conv.sentiment,
            "date": conv.created_at.strftime("%Y-%m-%d %I:%M %p") if conv.created_at else None,
            "transcript": conv.transcript,
            "ai_summary": conv.ai_summary,
        })

    logger.info(f"Returned {len(result)} conversations")
    return result
