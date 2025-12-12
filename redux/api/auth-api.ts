// src/redux/api/auth-api.ts
import { Permission } from "@/types/permission";
import { apiClient } from "./api-client";

interface LoginPayload {
  user_id: string;
  password: string;
  remember_me: boolean;
  recaptcha_token: string;
}

interface LoginResponse {
  message: string;
  data: {
    activity_id: string;
    token: string;
    user_id: string;
    user_name: string;
    role_id: string;
    role_name: string;
    permissions: Permission[];
  };
}

interface LogoutPayload {
  activity_id: string;
  user_id: string;
}

interface LogoutResponse {
  message: string;
}

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>("/api/v1/auth/login", payload);

    if (response.status === 200 && response.data.data) {
      const { token, user_id, user_name, role_id, role_name, permissions, activity_id } = response.data.data;

      // Store data in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user_id", user_id);
      localStorage.setItem("user_name", user_name);
      localStorage.setItem("role_id", role_id);
      localStorage.setItem("role_name", role_name);
      localStorage.setItem("activity_id", activity_id);
      localStorage.setItem("permissions", JSON.stringify(permissions));

      // Store token in cookie for middleware access
      // Set cookie with secure options
      const maxAge = payload.remember_me ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // 30 days or 1 day
      document.cookie = `token=${token}; path=/; max-age=${maxAge}; SameSite=Strict${window.location.protocol === 'https:' ? '; Secure' : ''}`;
    }

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Login failed");
  }
};

export const logout = async (): Promise<void> => {
  try {
    const activity_id = localStorage.getItem("activity_id") || "";
    const user_id = localStorage.getItem("user_id") || "";

    // Call logout API
    await apiClient.post<LogoutResponse>("/api/v1/auth/logout", {
      activity_id,
      user_id,
    });
  } catch (error) {
    console.error("Logout API error:", error);
    // Continue with logout even if API fails
  } finally {
    // Clear all auth data from localStorage
    clearAuthData();

    // Redirect to login page
    window.location.href = "/auth/login";
  }
};

export const clearAuthData = () => {
  // Clear all auth data from localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("user_id");
  localStorage.removeItem("user_name");
  localStorage.removeItem("role_id");
  localStorage.removeItem("role_name");
  localStorage.removeItem("activity_id");
  localStorage.removeItem("permissions");

  // Clear token cookie
  document.cookie = "token=; path=/; max-age=0; SameSite=Strict";
};
