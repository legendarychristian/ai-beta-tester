from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List, Dict
from gemini import evaluate_multiple_pitches, process_convo
from util import calculate_scores, analyze_demographics_with_defaults
from fastapi.responses import FileResponse
import boto3
from pydub import AudioSegment
import os
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

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))  # Moves up one level
AUDIO_DIR = os.path.join(BASE_DIR, "audio_files")

polly_client = boto3.Session(
                aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],                 
    aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    region_name='us-east-1').client('polly')

AUDIO_FILE_PATH = os.path.join(AUDIO_DIR, "final_conversation.wav")

@app.get("/conversation/play")
async def play_conversation():
    """
    API to serve the final conversation audio file.
    Returns the WAV file as a response if it exists.
    """
    if not os.path.exists(AUDIO_FILE_PATH):
        raise HTTPException(status_code=404, detail="Audio file not found")

    return FileResponse(AUDIO_FILE_PATH, media_type="audio/wav", filename="final_conversation.wav")


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
        print(f'Convo results: {convo_results}')
        print(f'Eval results: {eval_results}')
        demographic_analysis = analyze_demographics_with_defaults(convo_results)
        scores = calculate_scores(eval_results)
        

        print(f'Demographic analysis: {demographic_analysis}')
        print(f'Scores: {scores}')
        
        best_result = convo_results[np.argmax(scores['sentiment_scores'])]
                
        print(f'Best result: {best_result}')
        # conversation audio
        # speech_switch, output_path, response = await text_to_speech(best_result)
        
        # print(f'Output path: {output_path}')
        
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

class ConversationData(BaseModel):
    convo_history: list
    scores: dict

@app.post("/conversation/get_best_conversation")
async def get_best_conversation(data: ConversationData):
    """
    Returns the best conversation based on the highest sentiment score.

    Request Body:
    - convo_history (list): A list of conversation results.
    - scores (dict): Dictionary containing "sentiment_scores" (list of numerical scores).

    Response:
    - result (dict): The conversation entry with the highest sentiment score.
    """
    try:
        if not data.convo_history or not data.scores.get("sentiment_scores"):
            raise HTTPException(status_code=400, detail="Invalid input: Missing conversation history or scores")

        sentiment_scores = np.array(data.scores["sentiment_scores"])

        if sentiment_scores.size == 0:
            raise HTTPException(status_code=400, detail="Invalid input: Sentiment scores list is empty")

        best_index = np.argmax(sentiment_scores)  # Get index of highest sentiment score
        best_result = data.convo_history[best_index]

        return {"result": best_result}
    
    except IndexError:
        raise HTTPException(status_code=500, detail="Error: Mismatch between scores and conversation history length")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class ConversationRequest(BaseModel):
    conversation: Dict

@app.post("/conversation/convert")
async def text_to_speech(data: ConversationRequest):
    """
    Converts conversation history into a single WAV file.
    """
    try:
        conversation = data.conversation  # Extract conversation object
        speech_switch = [0]
        combined_audio = AudioSegment.silent(duration=0)

        if "chat_history" not in conversation or not isinstance(conversation["chat_history"], list):
            raise HTTPException(status_code=400, detail="Invalid chat_history format")

        buyer_gender = conversation.get("persona", {}).get("sex", "Male")  # Default to Male

        for index, turn in enumerate(conversation["chat_history"]):
            role = turn.get("role", "")
            parts = turn.get("parts", [])

            if not parts:
                continue  # Skip empty messages

            chat_text = parts[0]  # Assume each message has one text part

            # Determine Polly voice
            voice = "Matthew" if role == "user" else ("Stephen" if buyer_gender == "Male" else "Ruth")

            # Call AWS Polly to synthesize speech
            response = polly_client.synthesize_speech(
                VoiceId=voice,
                OutputFormat="mp3",
                Text=chat_text,
                Engine="generative"
            )

            # Save MP3 file temporarily
            temp_audio_path = os.path.join(AUDIO_DIR, f"audio_{index}.mp3")
            with open(temp_audio_path, "wb") as file:
                file.write(response["AudioStream"].read())

            # Append to the combined audio file
            clip = AudioSegment.from_mp3(temp_audio_path)
            combined_audio += clip + AudioSegment.silent(duration=200)
            speech_switch.append(len(combined_audio))  # Store speech timing

        # Export the final WAV file
        output_path = os.path.join(AUDIO_DIR, "final_conversation.wav")
        combined_audio.export(output_path, format="wav")

        return {
            "speech_switch": speech_switch,
            "file_url": "/conversation/play"
        }

    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Missing field: {str(e)}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)