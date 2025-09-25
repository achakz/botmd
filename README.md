# 📖 BotMD – AI-Powered Medical Assistant

BotMD is an **AI-powered chatbot** that supports two modes:

- 🧪 **Prediction Mode** – Users enter their symptoms in natural language.
    
    - Symptoms are extracted using an **LLM** (Llama 3.1 via Ollama).
        
    - A trained **ML model** (Random Forest / XGBoost) predicts possible diseases.
        
    - A separate LLM step generates a **humanized medical response**.
        
    - Predictions are cached in **Redis** for fast repeated queries.
        
- 💬 **Chat Mode** – Users can ask **general health-related questions**, answered by the LLM with an empathetic disclaimer.
    

⚠️ **Disclaimer**: BotMD is **not a substitute for professional medical advice**. Always consult a qualified healthcare provider for medical concerns.

---

## 🚀 Features

- Symptom extraction from free-text input using **LLM**.
    
- Disease prediction via **ML model** trained on symptom–disease dataset.
    
- Humanized explanations with suggested doctor specialization via LLM.
    
- **Redis caching** to reduce repeated computation and improve latency.
    
- Toggle between **Prediction Mode** and **Chat Mode** in the frontend.
    
- Built with **MERN stack + FastAPI microservice**.
    

---

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite, Material UI)
    
- **Backend (Core API)**: Express.js, MongoDB, JWT Authentication
    
- **Backend (AI Microservice)**: FastAPI, Scikit-learn, Joblib, Ollama (Llama 3.1)
    
- **Caching**: Redis
    
- **Other Tools**: Docker (planned), Postman for API testing
