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

Return ONLY valid JSON in this format:

{{
    "reply": "response to customer",
    "extracted_data": {{
        "name": "",
        "phone": "",
        "email": "",
        "requirement": "",
        "budget": "",
        "timeline": "",
        "intent": "general",
        "appointment_date": "",
        "appointment_time": "",
        "ai_summary": ""
    }}
}}
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
        # Strip markdown code fences if present
        if content.startswith("```"):
            content = content.lstrip("`").lstrip("\n")
        if content.endswith("```"):
            content = content.rstrip("`").rstrip("\n")
        return json.loads(content)
    except Exception:
        return {
            "reply": content,
            "extracted_data": {}
        }


def normalize_lead_data(extracted_data: dict):
    if not isinstance(extracted_data, dict) or not extracted_data:
        return extracted_data

    def needs_normalization(value):
        if not isinstance(value, str) or value.strip() == "":
            return False
        # Detect Devanagari/Hindi script characters
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
            content = content.lstrip("`").lstrip("\n")
        if content.endswith("```"):
            content = content.rstrip("`").rstrip("\n")
        normalized = json.loads(content)
        return {**extracted_data, **normalized}
    except Exception:
        return extracted_data
