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

export const getUserHistory = async (token) => {
  const res = await API.get("/history", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
