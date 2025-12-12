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
  async (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      console.warn("🚫 401 Unauthorized - Session expired or invalid token");

      // Dynamically import to avoid circular dependency
      const { clearAuthData } = await import("./auth-api");

      // Clear auth data
      clearAuthData();

      // Redirect to login page
      window.location.href = "/auth/login";

      return Promise.reject(error);
    }

    // Handle other errors
    const message = `API error: ${error.response?.data?.message || error.message}`;
    console.error(message);
    showErrorToast(message);
    return Promise.reject(error);
  }
);
