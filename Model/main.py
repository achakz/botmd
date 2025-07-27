from fastapi import FastAPI, Request
from app.predict import get_prediction

app = FastAPI()

@app.post("/predict")
async def predict(request: Request):
    data = await request.json()
    symptoms = data.get("symptoms", [])
    if not symptoms:
        return {"error": "No symptoms provided"}
    results = get_prediction(symptoms)
    return {"results": results}