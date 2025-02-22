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

# @app.post("/conversation/start")
# async def start_conversation(data: ConversationStart):
#     try:
#         conversation_history = process_convo(data.product_info)
        
#         conversation_response = {
#             "status": "success",
#             "conversation_history": conversation_history,
#         }
        
#         return conversation_response
        
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

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