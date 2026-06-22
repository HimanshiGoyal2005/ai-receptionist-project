import os
import json
from fastapi import FastAPI, HTTPException, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
load_dotenv()
from app.database import create_tables
from app.api.leads_api import router as leads_router
from app.api.appointments_api import router as appointments_router
from app.api.call_api import router as call_router
from app.api.analytics_api import router as analytics_router
from app.api.conversations_api import router as conversations_router
from app.api.auth_api import router as auth_router
from app.services.llm_service import get_sales_response
# 🚨 FIXED IMPORT: Added Google Calendar generation node along with WhatsApp and Email
from app.services.automation_service import send_whatsapp_followup, send_email_followup, generate_google_calendar_link
from app.utils.logger import get_logger

logger = get_logger("main")

os.makedirs("static/audio", exist_ok=True)
os.makedirs("static/uploads", exist_ok=True)

app = FastAPI(
    title="AI Voice Receptionist",
    description="Backend API for AI Voice Receptionist System",
    version="2.0.0"
)
origins = [
    "https://ai-receptionist-project-n83049usd-himanshis-projects-2ac0713f.vercel.app", 
    "http://localhost:5173", # Keep this for local dev
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # Explicitly list your production URL here
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


# 📡 1. REAL-TIME SOCKET POOL FOR HUMAN ACCESS
connected_agents = []

@app.websocket("/ws/handoff")
async def websocket_handoff_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_agents.append(websocket)
    logger.info("📡 [SOCKET CONNECTED] A real human agent dashboard has logged in.")
    try:
        while True:
            # Active transmission listener
            data = await websocket.receive_text()
            # Broadcast user chat message to all connected admins live
            for agent in connected_agents:
                await agent.send_text(data)
    except WebSocketDisconnect:
        connected_agents.remove(websocket)
        logger.info("📡 [SOCKET DISCONNECTED] Human agent closed the connection.")


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
# 🤖 UPGRADED SALES AGENT INTERFACE PIPELINE
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
        extracted = result.get("extracted_data", {})
        
        # 🚨 TRIGGER A: Alert real human agent screens via socket pool
        if result.get("handoff_triggered") == True:
           logger.warn("[HANDOFF TRIGGERED] Broadcasting emergency alert packet to human dashboards.")
    
        for agent in connected_agents:
                await agent.send_text(json.dumps({
                    "event": "HANDOFF_ALERT",
                    "message": "Connecting you to a human representative.",
                    "client_requirement": extracted.get("requirement", "Custom Complex Query")
                }))

        # 🚨 TRIGGER B: Automated Email, WhatsApp & Google Calendar on closing matrix
        if result.get("stage") in ["MEETING", "CLOSING"]:
            customer_phone = extracted.get("phone") or "9876543210"
            customer_email = extracted.get("email") or "client@company.com"
            
            # Fire free simulation notification logs to terminal screen
            send_whatsapp_followup(customer_phone, extracted)
            send_email_followup(customer_email, extracted)
            
            # 📅 New Node Added: Fires interactive Google Calendar link directly to terminal logs
            generate_google_calendar_link(extracted)
            
        return result

    except HTTPException as http_err:
        raise http_err
    except Exception as err:
        logger.error(f"Root Sales workspace route crashed: {str(err)}")
        raise HTTPException(status_code=500, detail=str(err))