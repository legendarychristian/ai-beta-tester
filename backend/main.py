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
        if file:
            # content = await file.read()
            # Optionally save or process the file here
            print(f"Received file: {file.filename}")
            # print(content)
            
        convo_results = await process_convo(product_info, file)
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
        speed_switch, output_path, response = await text_to_speech(best_result)
        
        print(f'Output path: {output_path}')
        
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
    

@app.post("/conversation/convert")
async def text_to_speech(conversation: Dict):
    """
    Converts conversation result (persona + history) to a single WAV file.
    
    Parameters:
    - conversation (Dict)
        e.g., {"persona": persona, "chat_history": local_chat_history}
    
    Returns:
    - speech_switch
    - output_path
    - FileResponse
    """
    try:
        speech_switch = [0]
        combined_audio = AudioSegment.silent(duration=0)
        buyer_gender = conversation['persona']['sex']

        for turn in conversation['chat_history']:
            role = turn['role']
            chat_text = turn['parts'][0]
            
            # Determine which Polly voice to use
            if role == "user":
                voice = "Matthew"
            else:
                if buyer_gender == "Male":
                    voice = "Stephen"
                else:
                    voice = "Ruth"

            # Call Polly to synthesize speech
            response = polly_client.synthesize_speech(
                VoiceId=voice,
                OutputFormat='mp3', 
                Text=chat_text,
                Engine='generative'
            )

            # Save the temporary MP3 file
            os.makedirs(AUDIO_DIR, exist_ok=True)
            
            temp_audio_path = os.path.join(AUDIO_DIR, "audio.mp3")
            
            with open(temp_audio_path, "wb") as file:
                file.write(response['AudioStream'].read())
                
            # Load the MP3 and append it with a short pause
            clip = AudioSegment.from_mp3(temp_audio_path)
            combined_audio += clip + AudioSegment.silent(duration=200)
            speech_switch.append(len(combined_audio))

        output_path = os.path.join(AUDIO_DIR, "final_conversation.wav")
        combined_audio.export(output_path, format="wav")

        return speech_switch, output_path, FileResponse(output_path, media_type="audio/wav")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)