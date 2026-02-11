import { create } from 'zustand';
import type { UserPreferences } from '../../domain/entities/UserPreferences';
import { DEFAULT_PREFERENCES } from '../../domain/entities/UserPreferences';
import {
  loadPreferences,
  updateUsername,
  toggleDarkMode,
} from '../../domain/use-cases/preferences';
import { asyncStorageService } from '../../services/storage/asyncStorageService';

interface PreferencesState extends UserPreferences {
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setUsername: (username: string) => Promise<void>;
  toggleDarkMode: () => Promise<void>;
}

/**
 * Zustand store — thin layer that delegates to domain use-cases.
 * All persistence flows through: Store action -> Use-case -> Service -> AsyncStorage
 */
export const usePreferencesStore = create<PreferencesState>((set, get) => ({
  ...DEFAULT_PREFERENCES,
  hydrated: false,

  hydrate: async () => {
    const prefs = await loadPreferences(asyncStorageService);
    set({ ...prefs, hydrated: true });
  },

  setUsername: async (username: string) => {
    const current = { username: get().username, darkMode: get().darkMode };
    const updated = await updateUsername(asyncStorageService, current, username);
    set(updated);
  },

  toggleDarkMode: async () => {
    const current = { username: get().username, darkMode: get().darkMode };
    const updated = await toggleDarkMode(asyncStorageService, current);
    set(updated);
  },
}));
