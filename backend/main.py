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

app = FastAPI()

# CORS setup to allow requests from your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

polly_client = boto3.Session(
                aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],                 
    aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    region_name='us-east-1').client('polly')

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
async def text_to_speech(conversation: dict):
    try:
        speech_switch = []
        combined_audio = AudioSegment.silent(duration=0)
        buyer_gender = conversation['persona']['Gender']

        for turn in conversation['chat_history']:
            role = turn['role']
            chat_text = turn['parts'][0]
            
            # Determine which Polly voice to use
            if role == "seller":
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
            with open("audio_files/audio.mp3", "wb") as file:
                file.write(response['AudioStream'].read())
                
            # Load the MP3 and append it with a short pause
            clip = AudioSegment.from_mp3("audio_files/audio.mp3")
            combined_audio += clip + AudioSegment.silent(duration=200)
            speech_switch.append(len(combined_audio))

        # Export the final WAV file
        output_path = "audio_files/final_audio.wav"
        combined_audio.export(output_path, format="wav")

        # Clean up the temporary file
        os.remove("audio_files/audio.mp3")

        # Return the final WAV file as a response
        # return FileResponse(output_path, media_type="audio/wav")
        # return {
        #     "audio": FileResponse(output_path, media_type="audio/wav"),
        #     "speech_switch": speech_switch,
        # }
        return FileResponse(output_path, media_type="audio/wav", headers={"speech_switch": str(speech_switch)})

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)