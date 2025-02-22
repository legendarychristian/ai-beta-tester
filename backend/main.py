from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List, Dict
from analyze_demographics import analyze_demographics_with_defaults
from scores import calculate_scores
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
    image_url: Optional[str] = None 

class Message(BaseModel):
    role: str
    message: str

class ConversationHistory(BaseModel):
    conversation_history: List[Message]

def process_convo(product_info: str) -> List[Message]:
    return [
        Message(role="system", message=f"Received product info: {product_info}")
    ]

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

# total demographic analysis
@app.post("/conversation/analyze")
async def analyze_conversation():
    try:
        analysis = analyze_demographics_with_defaults()
        return {
            "status": "success",
            "analysis": analysis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# metrics for all buyers
@app.get("/conversation/metrics")
async def get_metrics():
    try:
        ratings = calculate_scores()
        return ratings
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)