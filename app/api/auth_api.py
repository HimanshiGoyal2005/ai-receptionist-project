from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel
from jose import jwt, JWTError
from passlib.context import CryptContext

from app.database import get_db
from app.models.user import User
from app.models.company import Company  # 🌟 Imported Company model for auto provisioning
from app.config import get_settings
from app.utils.logger import get_logger

logger = get_logger("auth_api")
router = APIRouter(prefix="/api/auth", tags=["Auth"])
settings = get_settings()

pwd_context = CryptContext(schemes=["sha256_crypt"], deprecated="auto")
security = HTTPBearer()


class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_token(data: dict) -> str:
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(hours=24)
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


@router.post("/register")
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    # ── STEP 1: Pass empty placeholders to instantiate user node first ──
    user = User(
        name=req.name,
        email=req.email,
        password_hash=hash_password(req.password),
        role="admin",
        company_id=None  # Temp initialization before company record generation
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # ── STEP 2: Automatically spin up a dedicated Company Node for this owner ──
    new_company = Company(
        company_name=f"{req.name}'s Organization",
        industry="Technology",
        phone=None,
        plan="free",
        status="active"
    )
    db.add(new_company)
    db.commit()
    db.refresh(new_company)

    # ── STEP 3: Link the user strictly to the newly generated company_id ──
    user.company_id = new_company.id
    db.commit()
    db.refresh(user)

    token = create_token({"user_id": user.id, "email": user.email, "company_id": user.company_id})
    logger.info(f"New user and workspace company auto-provisioned: {user.email}")
    return {
        "token": token, 
        "user": {
            "id": user.id, 
            "name": user.name, 
            "email": user.email, 
            "company_id": user.company_id
        }
    }


@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    token = create_token({"user_id": user.id, "email": user.email, "company_id": user.company_id})
    logger.info(f"User logged in: {user.email}")
    return {
        "token": token,
        "user": {
            "id": user.id, 
            "name": user.name, 
            "email": user.email, 
            "role": user.role, 
            "company_id": user.company_id
        }
    }


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "company_id": current_user.company_id
    }