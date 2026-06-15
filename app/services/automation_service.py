import os
import json
import urllib.parse
from app.utils.logger import get_logger

logger = get_logger("automation_service")

def send_whatsapp_followup(phone_number: str, extracted_data: dict):
    """Simulates/Triggers official WhatsApp template message flow"""
    phone = phone_number or "9876543210"
    
    whatsapp_payload = {
        "messaging_product": "whatsapp",
        "to": phone,
        "type": "template",
        "template": {
            "name": "call_followup_summary",
            "language": { "code": "en" },
            "components": [
                {
                    "type": "body",
                    "parameters": [
                        { "type": "text", "text": "Thank you for calling AI Receptionist." },
                        { "type": "text", "text": f"Requirement: {extracted_data.get('requirement', 'CCTV AI')}" },
                        { "type": "text", "text": f"Budget: {extracted_data.get('budget', '₹1 Lakh')}" },
                        { "type": "text", "text": f"Timeline: {extracted_data.get('timeline', '15 Days')}" }
                    ]
                }
            ]
        }
    }
    
    logger.info(f" [WHATSAPP SIMULATION] Payload prepared for {phone}. No external API call was made.")
    print(f"\n--- WHATSAPP SIMULATION PAYLOAD To {phone} ---\n{json.dumps(whatsapp_payload, indent=2)}\n----------------------")
    return True


def send_email_followup(recipient_email: str, extracted_data: dict):
    """Dispatches corporate summary node directly to the client profile"""
    email = recipient_email or "customer@corporate.com"
        
    email_html_body = f"""
    <div style="font-family: Arial, sans-serif; background: #0d1117; color: #fff; padding: 20px; border-radius: 12px;">
        <h2 style="color: #6366f1;">🤖 AI Receptionist — Call Summary Matrix</h2>
        <p>Thank you for interacting with our cognitive platform. Here is your structured summary:</p>
        <hr style="border-color: rgba(255,255,255,0.1);" />
        <ul>
            <li><b>Requirement Captured:</b> {extracted_data.get('requirement', 'CCTV AI System')}</li>
            <li><b>Budget Constrain:</b> {extracted_data.get('budget', '₹1 Lakh')}</li>
            <li><b>Timeline Threshold:</b> {extracted_data.get('timeline', '15 Days')}</li>
        </ul>
        <p style="color: #10b981;">Status: Automated Meeting Booked inside System Calendar.</p>
    </div>
    """
    logger.info(f" [EMAIL SIMULATION] Email payload prepared for {email}. No SMTP/send API call was made.")
    print(f"\n--- EMAIL SIMULATION OUTBOUND To {email} ---\n{email_html_body}\n--------------------")
    return True


def generate_google_calendar_link(extracted_data: dict):
    """Generates a zero-cost, instant Google Calendar scheduling hyperlink payload"""
    requirement = extracted_data.get('requirement', 'CCTV AI System Deal')
    budget = extracted_data.get('budget', '₹1 Lakh')
    timeline = extracted_data.get('timeline', '15 Days')
    
    # URL friendly string parsing for direct browser layout rendering
    title = urllib.parse.quote(f"🤖 AI Receptionist: Follow-up for {requirement}")
    details = urllib.parse.quote(
        f"Automated Lead Meeting Matrix Locked.\n\n"
        f"📋 Captured Requirement: {requirement}\n"
        f"💰 Customer Budget: {budget}\n"
        f"⏳ Expected Timeline: {timeline}\n\n"
        f"Status: Formulated via Automated AI Sales Pipeline."
    )
    
    # Creates a direct interactive standard event layout structure
    calendar_url = f"https://calendar.google.com/calendar/render?action=TEMPLATE&text={title}&details={details}"
    
    logger.info(" [CALENDAR SYNC] Google Calendar link compiled successfully.")
    print(f"\n--- 📅 GOOGLE CALENDAR SYNC NODE ACTIVATED ---")
    print(f"🔗 Live Google Calendar Event Link Generated Successfully:")
    print(f"{calendar_url}")
    print(f"--------------------------------------------------")
    return calendar_url