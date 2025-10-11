import google.generativeai as genai
import os
from dotenv import load_dotenv  # ✅ load .env support

# Load environment variables
load_dotenv(dotenv_path=".env")  # 👈 ensure .env is loaded before using os.getenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

try:
    test_model = genai.GenerativeModel("gemini-2.5-flash-lite")
    resp = test_model.generate_content("Hello! Can you tell me about Batman?")
    print("✅ Gemini API connected successfully!")
    print(f"Gemini Response: {resp.text}")
except Exception as e:
    print(f"❌ Gemini API key or connection error: {e}")