import { Platform } from 'react-native';

const trimSlash = (value: string) => value.replace(/\/+$/, '');

const defaultHost = Platform.select({
  android: '10.0.2.2',
  ios: '127.0.0.1',
  web: 'localhost',
  default: '127.0.0.1',
});

const defaultApiBaseUrl = `http://${defaultHost}:5000/api/v1`;
const defaultSocketUrl = `http://${defaultHost}:5000`;

export const appConfig = {
  apiBaseUrl: trimSlash(
    process.env.EXPO_PUBLIC_API_BASE_URL || process.env.EXPO_PUBLIC_API_URL || defaultApiBaseUrl
  ),
  socketUrl: trimSlash(process.env.EXPO_PUBLIC_SOCKET_URL || defaultSocketUrl),
  environment: process.env.EXPO_PUBLIC_APP_ENV || 'development',
  razorpayKeyId: process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || '',
};

export const roleRoutes = {
  rider: '/(passenger)',
  driver: '/(driver)',
  admin: '/(admin)',
} as const;

export const roleLabels = {
  rider: 'Passenger',
  driver: 'Driver',
  admin: 'Admin',
} as const;
