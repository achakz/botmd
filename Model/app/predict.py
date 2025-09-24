# app/predict.py
import json
import joblib
import numpy as np
import os
import hashlib
import redis
from .llm_handler import extract_symptoms_with_llm, humanize_prediction_with_llm

# Load ML artifacts
script_dir = os.path.dirname(__file__)
model_path = os.path.join(script_dir, 'models', 'disease_model.pkl')
label_path = os.path.join(script_dir, 'models', 'label_encoder.pkl')
symptom_path = os.path.join(script_dir, 'models', 'symptom_columns.pkl')

model = joblib.load(model_path)
le = joblib.load(label_path)
symptom_columns = joblib.load(symptom_path)

# Redis client
redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
CACHE_TTL_SECONDS = 86400 * 7  # 7 days
CACHE_VERSION = "v1"  # bump if schema/logic changes

def get_prediction(user_text: str, top_k=3):
    # ---- Step 1: Extract symptoms ----
    extracted_symptoms = extract_symptoms_with_llm(user_text, symptom_columns)
    print(f"Extracted symptoms: {extracted_symptoms}")

    if not extracted_symptoms:
        return {"humanized_response": "I couldn't detect any valid symptoms from your input. Please try describing them more clearly, and remember to consult a doctor for any health concerns."}

    # ---- Step 2: Cache key based on symptoms ----
    sym_str = ",".join(sorted(set(extracted_symptoms)))
    sym_hash = hashlib.sha256(sym_str.encode()).hexdigest()
    cache_key = f"{CACHE_VERSION}:sym_pred:{sym_hash}"

    # ---- Step 3: Try cache ----
    try:
        cached_pred = redis_client.get(cache_key)
        if cached_pred:
            print("DEBUG: Cache HIT for symptoms -> prediction")
            return json.loads(cached_pred)
    except redis.RedisError as e:
        print(f"Redis error on GET: {e}")

    print("DEBUG: Cache MISS, running ML + LLM...")

    # ---- Step 4: Run ML model ----
    input_vector = np.zeros(len(symptom_columns))
    for sym in extracted_symptoms:
        if sym in symptom_columns:
            idx = symptom_columns.index(sym)
            input_vector[idx] = 1

    probs = model.predict_proba([input_vector])[0]
    top_indices = np.argsort(probs)[-top_k:][::-1]
    top_scores = probs[top_indices]

    prediction_data = [
        {"disease": le.inverse_transform([idx])[0].strip(), "score": round(float(score), 2)}
        for idx, score in zip(top_indices, top_scores) if score >= 0.25
    ]

    if not prediction_data:
        resp = {
            "humanized_response": "Based on the symptoms provided, I couldn't find a confident match. It's very important to consult a healthcare professional for an accurate diagnosis."
        }
    else:
        humanized_response = humanize_prediction_with_llm(prediction_data, extracted_symptoms)
        resp = {
            "humanized_response": humanized_response,
            "structured_prediction": prediction_data,
            "extracted_symptoms": extracted_symptoms,
        }

    # ---- Step 5: Cache response ----
    try:
        redis_client.set(cache_key, json.dumps(resp), ex=CACHE_TTL_SECONDS)
        print("DEBUG: Stored prediction in cache")
    except redis.RedisError as e:
        print(f"Redis error on SET: {e}")

    return resp