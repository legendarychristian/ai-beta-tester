from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List, Dict
from gemini import evaluate_multiple_pitches, process_convo
from util import calculate_scores, analyze_demographics_with_defaults
import numpy as np

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


@app.post("/conversation/start")
async def start_conversation(
    product_info: str = Form(...),
    file: Optional[UploadFile] = File(None)
):
    try:
        convo_results = process_convo(product_info) 
        eval_results = evaluate_multiple_pitches(convo_results)
        demographic_analysis = analyze_demographics_with_defaults(convo_results)
        scores = calculate_scores(eval_results)
        
        print(f'Convo results: {convo_results}')
        print(f'Eval results: {eval_results}')
        print(f'Demographic analysis: {demographic_analysis}')
        print(f'Scores: {scores}')
        
        best_sentiment_result = convo_results[np.argmax(scores['sentiment_scores'])] 
        # tts("The best sentiment result is: " + best_sentiment_result['conversation_history'])
        
        print(f'Best sentiment result: {best_sentiment_result}')
        
        if file:
            content = await file.read()
            # Optionally save or process the file here
            print(f"Received file: {file.filename}, size: {len(content)} bytes")

        return {
            "status": "success",
            "convo_results": convo_results,
            "eval_results": eval_results,
            "demographic_analysis": demographic_analysis,
            "scores": scores,
            "file_received": file.filename if file else None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def tts():
    pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)