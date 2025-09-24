#app/llm_handler.py
import json
import requests

OLLAMA_ENDPOINT = "http://localhost:11434/api/generate"
LLM_MODEL = "llama3.1"

def _stream_llm_response(prompt):
    payload = {
        "model": LLM_MODEL,
        "prompt": prompt,
        "stream": False,
        "format": "json"
    }
    try:
        response = requests.post(OLLAMA_ENDPOINT, json=payload, timeout=60)
        response.raise_for_status()
        response_json_str = response.json().get("response", "{}")
        print(f"DEBUG: Raw LLM response: {response_json_str}")  # Debugging
        return json.loads(response_json_str)
    except (requests.RequestException, json.JSONDecodeError) as e:
        print(f"Error communicating with or parsing response from LLM: {e}")
        return None

def extract_symptoms_with_llm(text: str, symptom_list: list):  # Renamed param to symptom_list
    symptoms_list_str = ", ".join(symptom_list)  # Use the passed list
    prompt = f"""
    SYSTEM: You are a symptom extraction engine. Your ONLY task is to identify medical symptoms EXACTLY as described in the user's text and map them to the closest matching terms from this standardized list: {symptoms_list_str}. Use ONLY terms that appear verbatim in the list and are DIRECTLY supported by the user's input. Do NOT infer, add, or invent symptoms not explicitly mentioned (e.g., if 'red spots' is said, use 'skin rash' or 'red spots over body' only if it matches, but do NOT add 'redness of eyes' unless stated). Return ONLY a JSON object with a single key 'symptoms' containing a list of matched strings. If no matches, return {{"symptoms": []}}.
    USER: {text}
    ASSISTANT:
    """
    response_data = _stream_llm_response(prompt)

    if not response_data or not isinstance(response_data, dict):
        print(f"LLM returned invalid format: {response_data}")
        return []

    # Primary check: Expected format
    if "symptoms" in response_data and isinstance(response_data["symptoms"], list):
        # Normalize and filter (handle underscores/spaces/case)
        normalized_list = [s.lower().replace('_', ' ') for s in symptom_list]
        return [symptom_list[normalized_list.index(s.lower().replace('_', ' '))] for s in response_data["symptoms"] if s.lower().replace('_', ' ') in normalized_list]  # Return original casing from list

    print(f"LLM returned unexpected format that could not be parsed: {response_data}")
    return []

def humanize_prediction_with_llm(prediction_data: list, extracted_symptoms: list):
    predictions_str = "; ".join([f"{pred['disease']} ({int(pred['score'] * 100)}% confidence)" for pred in prediction_data])
    symptoms_str = ", ".join(extracted_symptoms)

    prompt = f"""
    SYSTEM: You are a medical assistant tasked with generating a humanized response. You MUST return a JSON object with a single key "humanized_response" containing a string. No other keys or formats are allowed.
USER: The user described symptoms: {symptoms_str}. The prediction model suggests these potential conditions: {predictions_str}.
ASSISTANT: Provide an empathetic, human-like paragraph. Start by acknowledging the user's symptoms using the exact terms provided. List the top predictions with their confidence scores. For each, suggest a relevant doctor or action (e.g., 'See a neurologist urgently' for Paralysis, 'Consult a general physician for Malaria', 'Visit an ENT specialist for Vertigo'). End with a mandatory disclaimer: 'This is not a medical diagnosis. Please consult a healthcare professional for accurate advice, especially if symptoms are severe or persistent. Seek help immediately if symptoms worsen tonight.'
    """
    response_data = _stream_llm_response(prompt)

    if not response_data or not isinstance(response_data, dict) or "humanized_response" not in response_data:
        print(f"DEBUG: Invalid humanization response, falling back: {response_data}")
        return "I'm sorry, I couldn't generate a detailed response. Please consult a healthcare professional for assistance with your symptoms."

    return response_data.get("humanized_response", "Could not generate a response.")

def get_chat_response_with_llm(text: str):
    prompt = f"""
    You are a helpful medical assistant. Answer the following question in a clear and concise way. Always include a disclaimer to consult a healthcare professional for medical advice.
    Question: "{text}"
    Return the response as a JSON object with a single key "chat_response".
    """
    response_data = _stream_llm_response(prompt)
    return response_data.get("chat_response", "I am sorry, I cannot answer that question.") if response_data else "An error occurred while processing your request."