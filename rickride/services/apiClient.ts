import axios from 'axios';

// Ensure the API url is pulled from the environment variables or falls back
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

/**
 * Global Axios instance specifically configured for the RikRide Backend API.
 * Future auth token interception (e.g., pulling a JWT from SecureStore and appending to headers)
 * can be added here inside axiosInstance.interceptors.request.use().
 */
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Example response interceptor for global error handling:
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);
