// src/redux/api/apiClient.ts
import { showErrorToast } from "@/utils/common";
import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Optional: intercept requests to attach auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Optional: global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = `API error: ${error.response?.data || error.message}`;
    console.error(message);
    showErrorToast(message);
    return Promise.reject(error);
  }
);
