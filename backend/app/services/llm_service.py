from groq import Groq
from openai import OpenAI
from app.config import settings

groq_client = Groq(api_key=settings.GROQ_API_KEY)
openai_client = OpenAI(api_key=settings.OPENAI_API_KEY)

SYSTEM_PROMPT = """You are a professional AI receptionist for a business consulting company.
Your job is to:
1. Listen to customer inquiries
2. Extract: name, phone number, requirement, budget
3. Detect intent: is this a lead inquiry, appointment booking, or FAQ?
4. Be polite and helpful
5. Ask clarifying questions if needed

Respond in the same language as the customer.
Always provide a reply that moves the conversation forward."""

async def get_ai_response(transcript: str, conversation_history: list = None) -> dict:
    """
    Process transcript through LLM and return structured response
    """
    if conversation_history is None:
        conversation_history = []
    
    messages = conversation_history + [
        {"role": "user", "content": transcript}
    ]
    
    try:
        if settings.USE_GROQ:
            response = groq_client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    *messages
                ],
                temperature=0.7,
                max_tokens=512,
            )
            reply = response.choices[0].message.content
        else:
            response = openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    *messages
                ],
                temperature=0.7,
                max_tokens=512,
            )
            reply = response.choices[0].message.content
        
        # Simple intent detection
        intent = "lead"
        if any(word in transcript.lower() for word in ["appointment", "meeting", "schedule", "book", "time"]):
            intent = "appointment"
        elif any(word in transcript.lower() for word in ["how", "what", "why", "tell me", "explain"]):
            intent = "faq"
        
        return {
            "reply": reply,
            "intent": intent,
            "extracted_data": {
                "name": None,
                "phone": None,
                "requirement": None,
                "budget": None,
            }
        }
    
    except Exception as e:
        print(f"LLM Error: {e}")
        return {
            "reply": "I apologize for the technical difficulty. Could you please try again?",
            "intent": "error",
            "extracted_data": {}
        }