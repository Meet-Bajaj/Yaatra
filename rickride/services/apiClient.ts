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

const MAX_RETRIES = 2;

const getRetryDelayMs = (retryCount: number) => 500 * 2 ** retryCount;

const shouldRetryRequest = (error: any) => {
  const method = String(error.config?.method || 'get').toLowerCase();
  const status = error.response?.status;

  // Avoid retrying non-idempotent operations to prevent duplicate writes.
  if (!['get', 'head', 'options'].includes(method)) {
    return false;
  }

  if (error.code === 'ECONNABORTED' || !error.response) {
    return true;
  }

  return [408, 429, 500, 502, 503, 504].includes(status);
};

const extractReadableErrorMessage = (error: any) => {
  const fallback = getErrorMessage(error);
  const payload = error.response?.data;

  if (!payload) {
    return fallback;
  }

  const baseMessage = payload.message || fallback;
  const details = Array.isArray(payload.details)
    ? payload.details
        .map((item: { field?: string; message?: string }) =>
          item?.field ? `${item.field}: ${item.message || 'Invalid value'}` : item?.message
        )
        .filter(Boolean)
    : [];

  if (!details.length) {
    return baseMessage;
  }

  return `${baseMessage} (${details.slice(0, 2).join(', ')})`;
};

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
    const config = error.config || {};
    const retryCount = Number(config.__retryCount || 0);

    if (shouldRetryRequest(error) && retryCount < MAX_RETRIES) {
      config.__retryCount = retryCount + 1;
      const delay = getRetryDelayMs(retryCount);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return apiClient(config);
    }

    const message = extractReadableErrorMessage(error);

    if (error.response?.status === 401) {
      await useAuthStore.getState().logout();
    }

    if (__DEV__) {
      // Keep API failures inspectable in development without polluting production logs.
      console.warn('[apiClient] Request failed', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message,
      });
    }

    Toast.show({
      type: 'error',
      text1: 'Request failed',
      text2: message,
    });

    return Promise.reject(error);
  }
);
