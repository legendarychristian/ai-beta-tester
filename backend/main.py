from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List, Dict

app = FastAPI()

# CORS setup to allow requests from your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConversationStart(BaseModel):
    product_info: str

class Message(BaseModel):
    role: str
    message: str

class ConversationHistory(BaseModel):
    conversation_history: List[Message]

@app.post("/conversation/start")
async def start_conversation(data: ConversationStart):
    try:
        conversation_history = process_convo(data.product_info)
        
        conversation_response = {
            "status": "success",
            "conversation_history": conversation_history,
        }
        
        return conversation_response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/conversation/analyze")
async def analyze_conversation(conversation: ConversationHistory):
    try:
        analysis = analyze_convo(conversation.conversation_history)
        return {
            "status": "success",
            "analysis": analysis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))