import json
from groq import Groq
from app.config import get_settings

settings = get_settings()

client = Groq(
    api_key=settings.groq_api_key
)


def get_llm_response(transcript: str):
    prompt = f"""
You are an AI receptionist.

Customer transcript:
{transcript}

Extract the customer’s lead qualification details and generate a lead score.
If budget, timeline, team size, or industry are missing from the transcript, ask a clear follow-up question in your reply.

Return ONLY valid JSON in this format:
{{
    "reply": "response to customer",
    "lead_score": "Hot Lead|Warm Lead|Cold Lead",
    "handoff_triggered": false,
    "extracted_data": {{
        "name": "",
        "phone": "",
        "email": "",
        "requirement": "",
        "budget": "",
        "timeline": "",
        "team_size": "",
        "industry": "",
        "intent": "general",
        "appointment_date": "",
        "appointment_time": "",
        "ai_summary": ""
    }}
}}

CRITICAL ADVANCED WORKFLOW RULES:
- HUMAN HANDOFF TRIGGER: Agar customer gusse mein hai, bohot complex technical query pooch raha hai, ya aisi cheez maang raha hai jo aap bechte nahi hain, toh "reply" mein bolo: "I am connecting you to a human representative right away. Please hold." aur JSON mein "handoff_triggered": true pass karo.
- SUMMARY LOGIC: Conversation ke steps ke dauran hamesha dynamic values extract karte raho jaise:
  - requirement (e.g., CCTV AI)
  - budget (e.g., ₹1 lakh)
  - timeline (e.g., 15 days)

Do not wrap the response in markdown or code fences.
Choose the lead score based on customer interest, qualification, and urgency.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.3
    )

    content = response.choices[0].message.content

    try:
        if content.startswith("```"):
            content = content.lstrip("`").lstrip("json").lstrip("\n")
        if content.endswith("```"):
            content = content.rstrip("`").rstrip("\n")
        return json.loads(content)
    except Exception:
        return {
            "reply": content,
            "lead_score": "Cold Lead",
            "handoff_triggered": False,
            "extracted_data": {}
        }


def normalize_lead_data(extracted_data: dict):
    if not isinstance(extracted_data, dict) or not extracted_data:
        return extracted_data

    def needs_normalization(value):
        if not isinstance(value, str) or value.strip() == "":
            return False
        return any("\u0900" <= ch <= "\u097F" for ch in value)

    if not any(needs_normalization(v) for v in extracted_data.values()):
        return extracted_data

    prompt = f"""
You are a lead data normalizer.

Convert the following lead fields into English text only and numeric digits wherever possible.
Return ONLY valid JSON with these exact keys:
{{
    "name": "",
    "phone": "",
    "email": "",
    "requirement": "",
    "budget": "",
    "timeline": "",
    "team_size": "",
    "industry": "",
    "intent": "",
    "appointment_date": "",
    "appointment_time": "",
    "ai_summary": ""
}}
If a field is empty or unknown, return an empty string.
Do not wrap the response in markdown or code fences.

Input:
{json.dumps(extracted_data, ensure_ascii=False)}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.2
    )

    content = response.choices[0].message.content

    try:
        if content.startswith("```"):
            content = content.lstrip("`").lstrip("json").lstrip("\n")
        if content.endswith("```"):
            content = content.rstrip("`").rstrip("\n")
        normalized = json.loads(content)
        return {**extracted_data, **normalized}
    except Exception:
        return extracted_data


def get_sales_response(transcript: str, conversation_history: list = None):
    if conversation_history is None:
        conversation_history = []
        
    sales_prompt = f"""You are an expert AI Sales Assistant for a tech company. Your job is to drive the conversation forward and never repeat the exact same response or questions.

Guide the user through this strict 5-step sales funnel based on their input:
1. QUALIFICATION: Understand their app/website/system requirements.
2. BUDGET: Ask about their budget range naturally.
3. PROPOSAL: Match their needs to a plan:
   - Basic Plan: ₹20,000 (Small apps/single feature)
   - Professional Plan: ₹50,000 (Clinic/Business apps with booking + management)
   - Enterprise Plan: Custom pricing (Large scale / Enterprise solutions)
4. MEETING: Propose a demo/meeting. If they say "today" or a time, acknowledge it instantly.
5. CLOSING: Confirm everything. If they ask for contact details or next steps here, give them our office support number: +91 98765 43210 and say our team will call them at their specified time.

CRITICAL RULES FOR INTEGRATED AUTOMATION PIPELINES:
- HUMAN HANDOFF TRIGGER: If the user is extremely angry, uses abusive language, or asks for highly complex technical architectures out of our scope, immediately say in your reply: "I am connecting you to a human representative right away. Please hold." and set "handoff_triggered" to true.
- If the user asks for pricing at ANY point, immediately list all 3 plans clearly, then ask which one sounds best.
- If a user has already answered a question (e.g., gave their budget or confirmed the time), DO NOT ask them again. Advance to the next stage.
- LANGUAGE RULE: Detect customer's language and respond in THE SAME language. Support: English, Hindi, Arabic, French, Spanish, Hinglish.
  * If customer writes Hindi -> reply in Hindi
  * If customer writes Arabic -> reply in Arabic
  * If customer writes French -> reply in French
  * If customer writes Spanish -> reply in Spanish
  * If customer writes English -> reply in English
  * If customer mixes Hindi+English (Hinglish) -> reply in Hinglish
- Keep responses short and crisp (max 2-3 sentences). Always end with a clear next step or confirmation.

Previous conversation history:
{json.dumps(conversation_history, ensure_ascii=False)}

Customer said: {transcript}

Return ONLY a valid JSON object. Do not add markdown code blocks like ```json. Match this exact structure:
{{
  "reply": "Your conversational response here in customer's language",
  "detected_language": "English|Hindi|Arabic|French|Spanish|Hinglish",
  "stage": "QUALIFICATION|BUDGET|PROPOSAL|MEETING|CLOSING",
  "suggested_plan": "Basic|Professional|Enterprise|null",
  "handoff_triggered": false,
  "extracted_data": {{
    "requirement": "extract if mentioned",
    "budget": "extract if mentioned",
    "timeline": "extract if mentioned",
    "email": "extract if mentioned",
    "phone": "extract if mentioned",
    "suggested_plan": "Basic or Professional or Enterprise"
  }}
}}"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": sales_prompt}],
        temperature=0.3
    )
    
    content = response.choices[0].message.content
    try:
        if content.startswith("```"):
            content = content.lstrip("`").lstrip("json").lstrip("\n")
        if content.endswith("```"):
            content = content.rstrip("`").rstrip("\n")
        return json.loads(content)
    except Exception:
        return {
            "reply": content,
            "detected_language": "English",
            "stage": "QUALIFICATION",
            "suggested_plan": None,
            "handoff_triggered": False,
            "extracted_data": {}
        }