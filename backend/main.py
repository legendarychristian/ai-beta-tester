from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS setup to allow requests from your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data model for the request body
class InputData(BaseModel):
    sentence: str

@app.post("/submit")
async def receive_sentence(data: InputData):
    return {"message": f"Received: {data.sentence}"}
