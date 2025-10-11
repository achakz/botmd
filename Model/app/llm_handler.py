import json
import os
import re
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold

# Configure Gemini with API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# --- START: NEW SAFETY SETTINGS ---
safety_settings = {
    HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
    HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
    HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
    HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
}
# --- END: NEW SAFETY SETTINGS ---

model = genai.GenerativeModel(
    model_name="gemini-2.0-flash-lite",
    safety_settings=safety_settings
)


# ✅ Utility to clean unwanted markdown symbols
def sanitize_text(text: str) -> str:
    if not text:
        return text
    text = re.sub(r"[*_`#>\[\]()~]", "", text)  # remove markdown symbols
    text = re.sub(r"\s{2,}", " ", text)          # normalize extra spaces
    return text.strip()


def _stream_llm_response(prompt):
    try:
        response = model.generate_content(prompt)

        if not response.parts:
            print(f"Gemini response was blocked or empty. Feedback: {response.prompt_feedback}")
            return None

        response_text = response.text.strip()

        # --- Handle cases like ```json ... ``` or plain JSON + extra text ---
        # Extract JSON-like substring safely
        json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
        if not json_match:
            print(f"⚠️ No JSON object detected in Gemini response:\n{response_text}")
            return None

        clean_json = json_match.group(0).strip()

        # Try parsing
        try:
            return json.loads(clean_json)
        except json.JSONDecodeError as je:
            print(f"⚠️ JSON decoding failed even after cleanup: {je}")
            print(f"Raw Gemini Response Text:\n{response_text}")
            return None

    except Exception as e:
        print(f"❌ Error generating or parsing response from Gemini: {e}")
        print(f"Raw Gemini Response Text: {response.text if 'response' in locals() else 'N/A'}")
        return None


def extract_symptoms_with_llm(text: str, symptom_list: list):
    symptoms_list_str = ", ".join([f'"{s}"' for s in symptom_list])
    prompt = f"""
    Analyze the user's text and identify symptoms. Your task is to map the described symptoms
    to the closest matching terms from this exact list: [{symptoms_list_str}].
    Do NOT use markdown symbols like *, #, or backticks in your response.
    Return ONLY a JSON object with a single key "symptoms" which contains a list of the matched strings.
    If the user says "I am not hungry", you must map it to "loss_of_appetite".
    If no relevant symptoms are found, return {{"symptoms": []}}.

    User Text: "{text}"
    """
    response_data = _stream_llm_response(prompt)
    if response_data and isinstance(response_data, dict) and "symptoms" in response_data:
        return response_data.get("symptoms", [])

    print(f"LLM returned an unexpected or empty format: {response_data}")
    return []


def humanize_prediction_with_llm(prediction_data: list, extracted_symptoms: list):
    predictions_str = "; ".join(
        [f"{pred['disease']} ({int(pred['score'] * 100)}% confidence)" for pred in prediction_data]
    )
    symptoms_str = ", ".join(extracted_symptoms)

    prompt = f"""
    You are an empathetic medical assistant.
    The user described: {symptoms_str}.
    Based on an ML model, the possible conditions are: {predictions_str}.
    Write a clear, human-like paragraph that:
      1. Acknowledges their symptoms.
      2. Mentions each predicted condition with its confidence.
      3. Suggests possible next steps (like consulting a specialist).
      4. Ends with: "This is not a medical diagnosis. Please consult a healthcare professional for accurate advice."
    
    DO NOT use markdown formatting (no *, #, lists, or bold text).
    You may use plain numbers (e.g., "1. Fever") if needed, but keep it plain text.

    Return ONLY this JSON format:
    {{
      "humanized_response": "<your paragraph>"
    }}
    """

    response_data = _stream_llm_response(prompt)

    if response_data and "humanized_response" in response_data:
        clean_text = sanitize_text(response_data["humanized_response"])
        return clean_text

    print(f"DEBUG: Invalid Gemini response format: {response_data}")
    return "I'm sorry, I couldn't generate a detailed response. Please consult a healthcare professional for assistance with your symptoms."


def get_chat_response_with_llm(text: str):
    prompt = f"""
    You are a helpful medical assistant.
    Answer the question clearly and in plain text.
    DO NOT use markdown symbols or formatting like *, #, or code blocks.
    Always include this disclaimer at the end: "Please consult a healthcare professional for medical advice."
    Return ONLY a JSON object with the key "chat_response".

    Question: "{text}"
    """

    response_data = _stream_llm_response(prompt)
    if response_data and "chat_response" in response_data:
        return sanitize_text(response_data["chat_response"])
    return "An error occurred while processing your question."
