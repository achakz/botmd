# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel # 1. Import BaseModel

# Load environment variables
load_dotenv(dotenv_path=".env")  #  ensure .env is loaded before using os.getenv()

# Import your application modules *after* loading the .env file
from app.predict import get_prediction
from app.llm_handler import get_chat_response_with_llm

# 2. Define a Pydantic model for the request body
class ChatRequest(BaseModel):
    mode: str = "chat"
    text: str

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Update the function to use the Pydantic model
@app.post("/chat")
def handle_chat(chat_request: ChatRequest): # Use the model here
    # 4. Access data directly from the model object
    mode = chat_request.mode
    user_text = chat_request.text

    if not user_text:
        return {"error": "No text provided"}

    if mode == "predict":
        results = get_prediction(user_text)
        return results
    elif mode == "chat":
        response = get_chat_response_with_llm(user_text)
        return {"chat_response": response}
    else:
        return {"error": "Invalid mode specified"}
