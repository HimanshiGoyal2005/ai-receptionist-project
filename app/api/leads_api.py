from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.lead import Lead
from app.schemas.lead_schema import LeadCreate, LeadUpdate, LeadResponse
from app.api.auth_api import get_current_user  # 🌟 Imported authentication dependency
from app.models.user import User  # 🌟 Imported User model for type checking

router = APIRouter(prefix="/api/leads", tags=["Leads"])


@router.post("/", response_model=LeadResponse)
def create_lead(
    lead: LeadCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)  # 🔒 Secured route
):
    # 🌟 Rule 1: Naya lead banate waqt login karne wale ki company_id aur user_id automatically fill hogi
    db_lead = Lead(
        **lead.model_dump(),
        user_id=current_user.id,
        company_id=current_user.company_id
    )
    db.add(db_lead)
    db.commit()
    db.refresh(db_lead)
    return db_lead


@router.get("/", response_model=List[LeadResponse])
def get_all_leads(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)  # 🔒 Secured route
):
    # 🌟 Rule 2: Pure database me se sirf wahi leads aayengi jo logged-in user ki company ki hain
    return db.query(Lead).filter(Lead.company_id == current_user.company_id).all()


@router.get("/{lead_id}", response_model=LeadResponse)
def get_lead(
    lead_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)  # 🔒 Secured route
):
    # 🌟 Rule 3: Single lead dekhte waqt bhi verify hoga ki woh isi company ki hai ya nahi
    lead = db.query(Lead).filter(
        Lead.id == lead_id, 
        Lead.company_id == current_user.company_id
    ).first()
    
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found or unauthorized access")
    return lead


@router.put("/{lead_id}", response_model=LeadResponse)
def update_lead(
    lead_id: int, 
    lead_update: LeadUpdate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)  # 🔒 Secured route
):
    # 🌟 Rule 4: Data update karte waqt check kiya jayega ki user apni hi company ka data update kar raha hai
    lead = db.query(Lead).filter(
        Lead.id == lead_id, 
        Lead.company_id == current_user.company_id
    ).first()
    
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found or unauthorized access")
        
    for key, value in lead_update.model_dump(exclude_unset=True).items():
        setattr(lead, key, value)
    db.commit()
    db.refresh(lead)
    return lead


@router.delete("/{lead_id}")
def delete_lead(
    lead_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)  # 🔒 Secured route
):
    # 🌟 Rule 5: Data delete karte waqt cross-company injection validation check
    lead = db.query(Lead).filter(
        Lead.id == lead_id, 
        Lead.company_id == current_user.company_id
    ).first()
    
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found or unauthorized access")
        
    db.delete(lead)
    db.commit()
    return {"message": "Lead deleted successfully"}