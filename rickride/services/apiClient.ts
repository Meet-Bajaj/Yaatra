import axios from 'axios';
import Toast from 'react-native-toast-message';

import { appConfig } from '../constants/config';
import { useAuthStore, getAuthToken } from '../store/useAuthStore';
import { getErrorMessage } from '../utils/errorMessages';

export const apiClient = axios.create({
  baseURL: appConfig.apiBaseUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const message = getErrorMessage(error);

    if (error.response?.status === 401) {
      await useAuthStore.getState().logout();
    }

    Toast.show({
      type: 'error',
      text1: 'Request failed',
      text2: message,
    });

    return Promise.reject(error);
  }
);
