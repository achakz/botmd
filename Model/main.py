import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel

# Load environment variables
load_dotenv(dotenv_path=".env")

from app.predict import get_prediction
from app.llm_handler import get_chat_response_with_llm

class ChatRequest(BaseModel):
    mode: str = "chat"
    text: str

app = FastAPI()

# Get allowed origins from environment
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
node_backend_url = os.getenv("NODE_BACKEND_URL", "http://localhost:5000")

# Enable CORS dynamically
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url, node_backend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat")
def handle_chat(chat_request: ChatRequest):
    mode = chat_request.mode
    user_text = chat_request.text

    if not user_text:
        return {"error": "No text provided"}

    if mode == "predict":
        return get_prediction(user_text)
    elif mode == "chat":
        return {"chat_response": get_chat_response_with_llm(user_text)}
    else:
        return {"error": "Invalid mode specified"}
