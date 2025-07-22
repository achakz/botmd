// src/services/api.js
import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

export const registerUser = async ({ name, email, password }) => {
  const res = await API.post("/auth/register", { name, email, password });
  return res.data;
};

export const loginUser = async ({ email, password }) => {
  const res = await API.post("/auth/login", { email, password });
  return res.data;
};

export const getMockHistory = async () => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  return [
    {
      timestamp: "2025-07-11T14:22:00Z",
      symptoms: ["fever", "dry cough", "fatigue"],
      results: [
        {
          disease: "COVID-19",
          score: 0.87,
          description: "A respiratory illness caused by coronavirus.",
          severity: "High",
        },
        {
          disease: "Flu",
          score: 0.72,
          description: "Influenza is a viral infection that attacks your respiratory system.",
          severity: "Medium",
        },
      ],
    },
    {
      timestamp: "2025-07-09T18:10:00Z",
      symptoms: ["sneezing", "runny nose", "itchy eyes"],
      results: [
        {
          disease: "Allergic Rhinitis",
          score: 0.91,
          description: "An allergic reaction that causes sneezing, congestion, and runny nose.",
          severity: "Low",
        },
      ],
    },
  ];
};
