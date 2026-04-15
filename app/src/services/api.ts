import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const LOCALHOST = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

const api = axios.create({
  baseURL: `${LOCALHOST}/api/v1`,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
