"use client";

import axios from "axios";

let isRedirecting = false;

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("yaatra-auth");
      if (raw) {
        const parsed = JSON.parse(raw);
        const token = parsed?.state?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch {
      // ignore parse errors
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isRedirecting) {
      const hadToken = error.config?.headers?.Authorization;
      if (hadToken && typeof window !== "undefined") {
        isRedirecting = true;
        localStorage.removeItem("yaatra-auth");
        // Session expiry must hard-navigate to drop client state; no router available in interceptors.
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
