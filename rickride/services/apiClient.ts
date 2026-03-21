import axios from 'axios';

import { getAuthToken } from '../store/useAuthStore';

// Ensure the API url is pulled from the environment variables or falls back
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

/**
 * Global Axios instance specifically configured for the RikRide Backend API.
 */
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to append JWT Token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Example response interceptor for global error handling:
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);
