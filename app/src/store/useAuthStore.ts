import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

type Role = 'rider' | 'driver' | 'admin';

interface User {
  id: string;
  phone: string;
  role: Role;
  name?: string;
}

interface AuthState {
  user: User | null | undefined; // undefined = loading
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: undefined,
  token: null,
  setAuth: async (user, token) => {
    await SecureStore.setItemAsync('token', token);
    await SecureStore.setItemAsync('user', JSON.stringify(user));
    set({ user, token });
  },
  logout: async () => {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('user');
    set({ user: null, token: null });
  },
  initAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      const userStr = await SecureStore.getItemAsync('user');
      if (token && userStr) {
        set({ token, user: JSON.stringify(userStr) });
      } else {
        set({ user: null, token: null });
      }
    } catch (error) {
      set({ user: null, token: null });
    }
  }
}));
