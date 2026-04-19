import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const SESSION_KEY = 'rickride.session';
const THEME_KEY = 'rickride.theme';

export interface PersistedSession {
  token: string;
  user: unknown;
}

export type ThemePreference = 'light' | 'dark' | 'system';

const webStorage = {
  getItem(key: string) {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    return localStorage.getItem(key);
  },
  setItem(key: string, value: string) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    }
  },
  removeItem(key: string) {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    }
  },
};

export const sessionStorage = {
  async getSession(): Promise<PersistedSession | null> {
    try {
      const rawValue =
        Platform.OS === 'web'
          ? webStorage.getItem(SESSION_KEY)
          : await SecureStore.getItemAsync(SESSION_KEY);

      return rawValue ? (JSON.parse(rawValue) as PersistedSession) : null;
    } catch {
      return null;
    }
  },

  async setSession(value: PersistedSession) {
    const serialized = JSON.stringify(value);
    if (Platform.OS === 'web') {
      webStorage.setItem(SESSION_KEY, serialized);
      return;
    }

    await SecureStore.setItemAsync(SESSION_KEY, serialized);
  },

  async clearSession() {
    if (Platform.OS === 'web') {
      webStorage.removeItem(SESSION_KEY);
      return;
    }

    await SecureStore.deleteItemAsync(SESSION_KEY);
  },
};

export const preferenceStorage = {
  async getThemePreference(): Promise<ThemePreference | null> {
    try {
      const rawValue =
        Platform.OS === 'web'
          ? webStorage.getItem(THEME_KEY)
          : await SecureStore.getItemAsync(THEME_KEY);

      if (!rawValue) {
        return null;
      }

      if (rawValue === 'light' || rawValue === 'dark' || rawValue === 'system') {
        return rawValue;
      }

      return null;
    } catch {
      return null;
    }
  },

  async setThemePreference(value: ThemePreference) {
    if (Platform.OS === 'web') {
      webStorage.setItem(THEME_KEY, value);
      return;
    }

    await SecureStore.setItemAsync(THEME_KEY, value);
  },
};
