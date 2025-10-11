// src/services/api.js
import axios from "axios";

const nodeBackendUrl = import.meta.env.VITE_NODE_BACKEND_URL || "http://localhost:5000/api";

const API = axios.create({ baseURL: nodeBackendUrl });

export const registerUser = async ({ name, email, password }) => {
  const res = await API.post("/auth/register", { name, email, password });
  return res.data;
};

export const loginUser = async ({ email, password }) => {
  console.log("Logging in with email:", email);
  const res = await API.post("/auth/login", { email, password });
  return res.data;
};

export const getUserHistory = async (token) => {
  const res = await API.get("/history", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const createChatSession = async (token, title) => {
  const res = await API.post(
    "/chat-sessions",
    { title },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const getUserChatSessions = async (token) => {
  const res = await API.get("/chat-sessions", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const deleteChatSession = async (token, sessionId) => {
  const res = await API.delete(`/chat-sessions/${sessionId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const addChatMessage = async (token, message) => {
  const res = await API.post("/chat-messages", message, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getMessagesBySession = async (token, sessionId) => {
  const res = await API.get(`/chat-messages/${sessionId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
