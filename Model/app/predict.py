import json
from .utils import jaccard_similarity

# Load disease-symptom mapping
with open("app/disease_data.json", "r", encoding="utf-8") as f:
    DISEASE_DATA = json.load(f)

def get_prediction(user_symptoms, top_k=3):
    scores = []
    for disease, symptoms in DISEASE_DATA.items():
        score = jaccard_similarity(set(user_symptoms), set(symptoms))
        scores.append((disease, score))

    # Sort and get top-K
    top_diseases = sorted(scores, key=lambda x: x[1], reverse=True)[:top_k]
    
    result = []
    for disease, score in top_diseases:
        result.append({
            "disease": disease,
            "score": round(score, 2),
            "description": "Placeholder description",  # to be updated later
            "severity": "Medium",                      # placeholder severity
        })
    return result
