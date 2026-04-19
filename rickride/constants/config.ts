import { Platform } from 'react-native';
import Constants from 'expo-constants';

const trimSlash = (value: string) => value.replace(/\/+$/, '');

const getExpoDevHost = () => {
  const hostUriFromExpoConfig = Constants.expoConfig?.hostUri;
  const hostUriFromManifest2 = (Constants as any).manifest2?.extra?.expoClient?.hostUri as
    | string
    | undefined;
  const debuggerHostFromLegacyManifest = (Constants as any).manifest?.debuggerHost as
    | string
    | undefined;

  const hostUri = hostUriFromExpoConfig || hostUriFromManifest2 || debuggerHostFromLegacyManifest;
  return hostUri?.split(':')[0] || null;
};

const resolveLocalhostForDevice = (urlValue: string) => {
  if (!__DEV__ || Platform.OS === 'web') {
    return trimSlash(urlValue);
  }

  try {
    const parsedUrl = new URL(urlValue);
    const isLocalHost = ['localhost', '127.0.0.1', '0.0.0.0'].includes(parsedUrl.hostname);

    if (!isLocalHost) {
      return trimSlash(urlValue);
    }

    const expoHost = getExpoDevHost();
    if (!expoHost) {
      return trimSlash(urlValue);
    }

    parsedUrl.hostname = expoHost;
    return trimSlash(parsedUrl.toString());
  } catch {
    return trimSlash(urlValue);
  }
};

const defaultHost = Platform.select({
  android: '10.0.2.2',
  ios: '127.0.0.1',
  web: 'localhost',
  default: '127.0.0.1',
});

const defaultApiBaseUrl = `http://${defaultHost}:5000/api/v1`;
const defaultSocketUrl = `http://${defaultHost}:5000`;

export const appConfig = {
  apiBaseUrl: resolveLocalhostForDevice(
    process.env.EXPO_PUBLIC_API_BASE_URL || process.env.EXPO_PUBLIC_API_URL || defaultApiBaseUrl
  ),
  socketUrl: resolveLocalhostForDevice(process.env.EXPO_PUBLIC_SOCKET_URL || defaultSocketUrl),
  environment: process.env.EXPO_PUBLIC_APP_ENV || 'development',
  razorpayKeyId: process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || '',
  googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',
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
