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

import Toast from 'react-native-toast-message';
import { useAuthStore } from '../store/useAuthStore';

// Example response interceptor for global error handling:
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error?.response?.data || error.message);
    
    let errorMessage = 'Something went wrong. Please try again later.';
    let isUnauthorized = false;

    if (error.response) {
      if (error.response.status === 401) {
        errorMessage = 'Session expired. Please log in again.';
        isUnauthorized = true;
      } else if (error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
    } else if (error.message === 'Network Error') {
      errorMessage = 'Network error. Please check your internet connection.';
    }

    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: errorMessage,
    });

    if (isUnauthorized) {
      // Trigger logout if we are unauthorized and not already on the login path
      const { logout } = useAuthStore.getState();
      logout();
    }

    return Promise.reject(error);
  }
);
