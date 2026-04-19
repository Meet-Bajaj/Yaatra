import { create } from 'zustand';

import { preferenceStorage, ThemePreference } from '../utils/storage';

interface ThemeState {
  hydrated: boolean;
  mode: ThemePreference;
  hydrate: () => Promise<void>;
  setMode: (mode: ThemePreference) => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set) => ({
  hydrated: false,
  mode: 'system',
  hydrate: async () => {
    const mode = await preferenceStorage.getThemePreference();
    set({ hydrated: true, mode: mode || 'system' });
  },
  setMode: async (mode) => {
    await preferenceStorage.setThemePreference(mode);
    set({ mode });
  },
}));
