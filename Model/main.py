from fastapi import FastAPI, Request
from app.predict import get_prediction
from app.llm_handler import get_chat_response_with_llm

app = FastAPI()

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