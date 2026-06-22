from datetime import datetime, timedelta

import requests
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel
from jose import jwt, JWTError
from passlib.context import CryptContext
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import os

from app.database import get_db
from app.models.user import User
from app.models.company import Company
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


class GoogleAuthRequest(BaseModel):
    token: str


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


@router.post("/google")
def google_auth(req: GoogleAuthRequest, db: Session = Depends(get_db)):
    # 1. DEBUG: Check if environment variables are loaded
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
    
    print(f"DEBUG: Client ID length: {len(client_id) if client_id else 0}")
    print(f"DEBUG: Client Secret length: {len(client_secret) if client_secret else 0}")

    token_url = "https://oauth2.googleapis.com/token"
    params = {
        "code": req.token,
        "client_id": client_id,
        "client_secret": client_secret,
        "redirect_uri": "http://localhost:5173/login",
        "grant_type": "authorization_code"
    }
    
    # 2. DEBUG: Log the request parameters (but mask the secret!)
    print(f"DEBUG: Sending request to Google with params: { {k: v for k, v in params.items() if k != 'client_secret'} }")
    
    response = requests.post(token_url, data=params)
    data = response.json()
    
    # 3. DEBUG: Log the full raw response from Google
    print(f"DEBUG: Raw response from Google: {data}")
    
    if "id_token" not in data:
        raise HTTPException(
            status_code=400, 
            detail=f"Google Exchange Error: {data.get('error', 'Unknown')} - {data.get('error_description', 'No description')}"
        )
        
    id_token_str = data["id_token"]
    
    # 4. Verify ID Token
    idinfo = id_token.verify_oauth2_token(
        id_token_str, google_requests.Request(), client_id,clock_skew_in_seconds=10
    )
    
    email = idinfo.get("email")
    name = idinfo.get("name")

    user = db.query(User).filter(User.email == email).first()

    if not user:
        user = User(
            name=name,
            email=email,
            password_hash=hash_password(os.urandom(16).hex()),
            role="admin",
            company_id=None
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        company = Company(
            company_name=f"{name}'s Organization",
            industry="Technology",
            phone=None,
            plan="free",
            status="active"
        )

        db.add(company)
        db.commit()
        db.refresh(company)

        user.company_id = company.id
        db.commit()
        db.refresh(user)

    token = create_token({
        "user_id": user.id,
        "email": user.email,
        "company_id": user.company_id
    })

    logger.info(f"Google login successful: {user.email}")

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


