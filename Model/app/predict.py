# app/predict.py
import json
from .utils import jaccard_similarity
from .llm_handler import extract_symptoms_with_llm, humanize_prediction_with_llm

with open("app/disease_data.json", "r", encoding="utf-8") as f:
    DISEASE_DATA = json.load(f)

# Compute unique standardized symptoms once
UNIQUE_SYMPTOMS = sorted(set(sym for syms in DISEASE_DATA.values() for sym in syms))

def get_prediction(user_text: str, top_k=3):
    # Pass unique symptoms to LLM for constrained extraction
    extracted_symptoms = extract_symptoms_with_llm(user_text, UNIQUE_SYMPTOMS)
    
    if not extracted_symptoms:
        return {"humanized_response": "I couldn't detect any valid symptoms from your input. Please try describing them more clearly, and remember to consult a doctor for any health concerns."}

    symptom_set = set(extracted_symptoms)
    
    scores = []
    for disease, disease_symptoms in DISEASE_DATA.items():
        score = jaccard_similarity(symptom_set, set(disease_symptoms))
        scores.append((disease, score))

    top_diseases = sorted(scores, key=lambda x: x[1], reverse=True)
    
    # Filter confident predictions (score >= 0.25)
    confident_predictions = [pred for pred in top_diseases if pred[1] >= 0.25]
    
    if not confident_predictions:
        return {"humanized_response": "Based on the symptoms provided, I couldn't find a confident match. It's very important to consult a healthcare professional for an accurate diagnosis as your symptoms could indicate various conditions."}

    # Take top_k (up to 3) for humanization
    top_predictions = confident_predictions[:top_k]
    
    prediction_data = [
        {"disease": disease.strip(), "score": round(float(score), 2)}  # Strip extra spaces in disease names like "Diabetes "
        for disease, score in top_predictions
    ]

    humanized_response = humanize_prediction_with_llm(prediction_data, extracted_symptoms)

    return {
        "humanized_response": humanized_response,
        "structured_prediction": prediction_data,  # Now a list of top 3
        "extracted_symptoms": extracted_symptoms
    }