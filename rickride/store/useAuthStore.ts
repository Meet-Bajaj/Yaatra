import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const JWT_KEY = 'rikride_jwt_token';

export interface UserProfile {
  _id: string;
  phone: string;
  role: 'passenger' | 'driver' | 'admin';
  name?: string;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (userData: UserProfile, token: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: (token: string, userData: UserProfile) => void;
  setLoading: (status: boolean) => void;
}

export const useAuthStore = create<AuthState>((set: any) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // Start true while we check SecureStore on boot

  login: async (userData: UserProfile, token: string) => {
    // Web platform won't support expo-secure-store easily without fallbacks, 
    // but building primarily for native
    if (Platform.OS !== 'web') {
      await SecureStore.setItemAsync(JWT_KEY, token);
    } else {
      localStorage.setItem(JWT_KEY, token);
    }
    set({ user: userData, token, isAuthenticated: true, isLoading: false });
  },

  logout: async () => {
    if (Platform.OS !== 'web') {
      await SecureStore.deleteItemAsync(JWT_KEY);
    } else {
      localStorage.removeItem(JWT_KEY);
    }
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  restoreSession: (token: string, userData: UserProfile) => {
    set({ user: userData, token, isAuthenticated: true, isLoading: false });
  },

  setLoading: (status: boolean) => {
    set({ isLoading: status });
  }
}));

// Quick helper to read token synchronously during API interceptors
export const getAuthToken = async () => {
    if (Platform.OS !== 'web') {
        return await SecureStore.getItemAsync(JWT_KEY);
    }
    return localStorage.getItem(JWT_KEY);
};
