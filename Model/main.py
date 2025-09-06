# main.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.predict import get_prediction
from app.llm_handler import get_chat_response_with_llm

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5000"],  # Adjust if your frontend runs on a different port
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods including OPTIONS
    allow_headers=["*"],
)

@app.post("/chat")
async def handle_chat(request: Request):
    data = await request.json()
    mode = data.get("mode", "chat")
    user_text = data.get("text", "")

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