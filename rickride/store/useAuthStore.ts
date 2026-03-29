import { create } from 'zustand';

import { User } from '../services/types';
import { sessionStorage } from '../utils/storage';

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  hydrated: boolean;
  status: AuthStatus;
  token: string | null;
  user: User | null;
  hydrate: () => Promise<void>;
  setSession: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  hydrated: false,
  status: 'idle',
  token: null,
  user: null,

  hydrate: async () => {
    const session = await sessionStorage.getSession();

    set({
      hydrated: true,
      status: session ? 'authenticated' : 'unauthenticated',
      token: session?.token || null,
      user: (session?.user as User | undefined) || null,
    });
  },

  setSession: async (token, user) => {
    await sessionStorage.setSession({ token, user });
    set({
      hydrated: true,
      status: 'authenticated',
      token,
      user,
    });
  },

  logout: async () => {
    await sessionStorage.clearSession();
    set({
      hydrated: true,
      status: 'unauthenticated',
      token: null,
      user: null,
    });
  },
}));

export const getAuthToken = async () => {
  const storeToken = useAuthStore.getState().token;
  if (storeToken) {
    return storeToken;
  }

  const session = await sessionStorage.getSession();
  return session?.token || null;
};
