import { create } from 'zustand';
import type { UserPreferences } from '../lib/types';
import { DEFAULT_PREFERENCES } from '../lib/types';
import { getItem, setItem } from '../lib/utils';

const STORAGE_KEY = 'user_preferences';

interface PreferencesState extends UserPreferences {
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setUsername: (username: string) => Promise<void>;
  toggleDarkMode: () => Promise<void>;
}

export const usePreferencesStore = create<PreferencesState>((set, get) => ({
  ...DEFAULT_PREFERENCES,
  hydrated: false,

  hydrate: async () => {
    const prefs = await getItem<UserPreferences>(STORAGE_KEY);
    set({ ...(prefs ?? DEFAULT_PREFERENCES), hydrated: true });
  },

  setUsername: async (username: string) => {
    const updated = { username, darkMode: get().darkMode };
    await setItem(STORAGE_KEY, updated);
    set(updated);
  },

  toggleDarkMode: async () => {
    const updated = { username: get().username, darkMode: !get().darkMode };
    await setItem(STORAGE_KEY, updated);
    set(updated);
  },
}));
