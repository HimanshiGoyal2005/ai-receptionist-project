import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import create_tables
from app.api.leads_api import router as leads_router
from app.api.appointments_api import router as appointments_router
from app.api.call_api import router as call_router
from app.api.analytics_api import router as analytics_router
from app.api.conversations_api import router as conversations_router
from app.api.auth_api import router as auth_router
from app.services.llm_service import get_sales_response
from app.utils.logger import get_logger

logger = get_logger("main")

os.makedirs("static/audio", exist_ok=True)
os.makedirs("static/uploads", exist_ok=True)

app = FastAPI(
    title="AI Voice Receptionist",
    description="Backend API for AI Voice Receptionist System",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

# Core Routers Integration
app.include_router(auth_router)
app.include_router(leads_router)
app.include_router(appointments_router)
app.include_router(call_router)
app.include_router(analytics_router)
app.include_router(conversations_router)


@app.on_event("startup")
def on_startup():
    create_tables()
    logger.info(" Database tables created!")
    logger.info("AI Voice Receptionist v2.0 started!")


@app.get("/health", tags=["Health"])
def health_check():
    logger.info("Health check called")
    return {"status": "ok", "message": "AI Voice Receptionist is running!", "version": "2.0.0"}


# ═════════════════════════════════════════════════════════════
# 🤖 STANDALONE SALES AGENT ENDPOINT WIRING
# ═════════════════════════════════════════════════════════════
@app.post("/api/sales/chat", tags=["Sales Agent"])
async def sales_chat(request: Request):
    try:
        body = await request.json()
        transcript = body.get("message", "").strip()
        history = body.get("history", [])
        
        if not transcript:
            raise HTTPException(status_code=400, detail="Message context token is empty")
        
        # Executes the multi-lingual Llama 3.3 state framework
        result = get_sales_response(transcript, history)
        return result

    except HTTPException as http_err:
        raise http_err
    except Exception as err:
        logger.error(f"Root Sales workspace route crashed: {str(err)}")
        raise HTTPException(status_code=500, detail=str(err))