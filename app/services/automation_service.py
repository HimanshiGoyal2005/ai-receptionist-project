import os
import json
import httpx
import urllib.parse
from app.utils.logger import get_logger

logger = get_logger("automation_service")

# LIVE API KEY INTEGRATION (Captured from your Resend Dashboard)
RESEND_API_KEY = "re_AjHm84wZ_5YwBTVjszbZ8MFzDcNYMqKHA"


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
                        { "type": "text", "text": f"Budget: {extracted_data.get('budget', '1 lakh')}" },
                        { "type": "text", "text": f"Timeline: {extracted_data.get('timeline', '15 days')}" }
                    ]
                }
            ]
        }
    }
    
    logger.info(f"[WHATSAPP SIMULATION] Payload prepared for {phone}.")
    print(f"\n--- WHATSAPP SIMULATION PAYLOAD To {phone} ---\n{json.dumps(whatsapp_payload, indent=2)}\n----------------------")
    return True


def send_email_followup(recipient_email: str, extracted_data: dict):
    """Dispatches a real professional HTML email directly to the dynamic customer endpoint"""
    try:
        raw_email = recipient_email.strip() if recipient_email else None
        email = None
        
        if raw_email:
            # 🚨 FIX: Agar multiple emails comma se separated hain, toh pehla email nikal lo
            if "," in raw_email:
                email = raw_email.split(",")[0].strip()
            else:
                email = raw_email
                
        # DYNAMIC ROUTING ENGINE: If customer mail is missing or dummy placeholder, route to admin tester
        if not email or "client@company.com" in email or "customer@corporate.com" in email:
            logger.info("[EMAIL ROUTER] Empty or default placeholder detected. Triggering Admin Testing Fallback.")
            email = "goyalhimanshi441@gmail.com"
        else:
            logger.info(f"[EMAIL ROUTER] Valid active customer profile identified for delivery: {email}")
            
        url = "https://api.resend.com/emails"
        headers = {
            "Authorization": f"Bearer {RESEND_API_KEY}",
            "Content-Type": "application/json"
        }

        email_html_body = f"""
        <div style="font-family: Arial, sans-serif; background: #0d1117; color: #fff; padding: 20px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.08);">
            <h2 style="color: #6366f1; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">AI Receptionist — Call Summary Matrix</h2>
            <p>Hello <b>{extracted_data.get('name', 'Valued Customer')}</b>,</p>
            <p>Thank you for interacting with our cognitive workspace platform. Here is your structured interaction summary:</p>
            <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
                <p>📋 <b>Requirement Captured:</b> {extracted_data.get('requirement', 'CCTV AI System')}</p>
                <p>💰 <b>Budget Constraint:</b> {extracted_data.get('budget', '1 lakh')}</p>
                <p>⏳ <b>Timeline Threshold:</b> {extracted_data.get('timeline', '15 days')}</p>
            </div>
            <p style="color: #10b981; font-weight: bold; margin-top: 15px;">Status: Automated Meeting Booked inside System Calendar Matrix.</p>
        </div>
        """

        payload = {
            "from": "AI Receptionist <onboarding@resend.dev>",
            "to": [email], # Ab yahan hamesha clean single string email hi jayega
            "subject": f"AI Receptionist: Meeting Follow-up for {extracted_data.get('requirement', 'Your Project')}",
            "html": email_html_body
        }

        # Safe HTTP Request loop
        response = httpx.post(url, json=payload, headers=headers)
        
        if response.status_code in [200, 201, 202]:
            logger.info(f"[REAL EMAIL SENT] HTML summary reached destination inbox: {email}")
            return True
        else:
            logger.error(f"[EMAIL FAILURE] Resend API rejected data frame: {response.text}")
            return False

    except Exception as err:
        logger.error(f"Email outbound network connection dropped: {str(err)}")
        return False
    """Dispatches a real professional HTML email directly to the dynamic customer endpoint"""
    try:
        # Clean the incoming parameter stream
        email = recipient_email.strip() if recipient_email else None
        
        # 🚨 DYNAMIC ROUTING ENGINE: If customer mail is missing or dummy placeholder, route to admin tester
        if not email or "client@company.com" in email or "customer@corporate.com" in email:
            logger.info("[EMAIL ROUTER] Empty or default placeholder detected. Triggering Admin Testing Fallback.")
            email = "goyalhimanshi441@gmail.com"
        else:
            logger.info(f"[EMAIL ROUTER] Valid active customer profile identified: {email}")
            
        url = "https://api.resend.com/emails"
        headers = {
            "Authorization": f"Bearer {RESEND_API_KEY}",
            "Content-Type": "application/json"
        }

        email_html_body = f"""
        <div style="font-family: Arial, sans-serif; background: #0d1117; color: #fff; padding: 20px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.08);">
            <h2 style="color: #6366f1; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">AI Receptionist — Call Summary Matrix</h2>
            <p>Hello <b>{extracted_data.get('name', 'Valued Customer')}</b>,</p>
            <p>Thank you for interacting with our cognitive workspace platform. Here is your structured interaction summary:</p>
            <div style="background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
                <p>📋 <b>Requirement Captured:</b> {extracted_data.get('requirement', 'CCTV AI System')}</p>
                <p>💰 <b>Budget Constraint:</b> {extracted_data.get('budget', '1 lakh')}</p>
                <p>⏳ <b>Timeline Threshold:</b> {extracted_data.get('timeline', '15 days')}</p>
            </div>
            <p style="color: #10b981; font-weight: bold; margin-top: 15px;">Status: Automated Meeting Booked inside System Calendar Matrix.</p>
        </div>
        """

        payload = {
            "from": "AI Receptionist <onboarding@resend.dev>",
            "to": [email],
            "subject": f"AI Receptionist: Meeting Follow-up for {extracted_data.get('requirement', 'Your Project')}",
            "html": email_html_body
        }

        # Safe HTTP Request loop
        response = httpx.post(url, json=payload, headers=headers)
        
        if response.status_code in [200, 201, 202]:
            logger.info(f"[REAL EMAIL SENT] HTML summary reached destination inbox: {email}")
            return True
        else:
            logger.error(f"[EMAIL FAILURE] Resend API rejected data frame: {response.text}")
            return False

    except Exception as err:
        logger.error(f"Email outbound network connection dropped: {str(err)}")
        return False


def generate_google_calendar_link(extracted_data: dict):
    """Generates a zero-cost, instant Google Calendar scheduling hyperlink payload"""
    requirement = extracted_data.get('requirement', 'CCTV AI System Deal')
    budget = extracted_data.get('budget', '1 lakh')
    timeline = extracted_data.get('timeline', '15 days')
    
    # Text scrubbed cleanly of unicode emojis to prevent terminal map crashes
    title = urllib.parse.quote(f"AI Receptionist: Follow-up for {requirement}")
    details = urllib.parse.quote(
        f"Automated Lead Meeting Matrix Locked.\n\n"
        f"Captured Requirement: {requirement}\n"
        f"Customer Budget: {budget}\n"
        f"Expected Timeline: {timeline}\n\n"
        f"Status: Formulated via Automated AI Sales Pipeline."
    )
    
    calendar_url = f"https://calendar.google.com/calendar/render?action=TEMPLATE&text={title}&details={details}"
    
    logger.info("[CALENDAR SYNC] Google Calendar link compiled successfully.")
    print(f"\n--- GOOGLE CALENDAR SYNC NODE ACTIVATED ---")
    print(f"URL: {calendar_url}")
    print(f"--------------------------------------------------")
    return calendar_url