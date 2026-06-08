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
        return json.loads(content)
    except Exception:
        return {
            "reply": content,
            "extracted_data": {}
        }