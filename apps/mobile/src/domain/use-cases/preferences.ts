import {
  type UserPreferences,
  DEFAULT_PREFERENCES,
} from '../entities/UserPreferences';
import type { IStorageService } from '../../services/interfaces/IStorageService';

const STORAGE_KEY = 'user_preferences';

/**
 * Pure use-case functions.
 * All persistence goes through the injected storage service.
 * UI never calls storage directly.
 */

export async function loadPreferences(
  storage: IStorageService,
): Promise<UserPreferences> {
  const stored = await storage.get<UserPreferences>(STORAGE_KEY);
  return stored ?? DEFAULT_PREFERENCES;
}

export async function savePreferences(
  storage: IStorageService,
  prefs: UserPreferences,
): Promise<void> {
  await storage.set(STORAGE_KEY, prefs);
}

export async function updateUsername(
  storage: IStorageService,
  current: UserPreferences,
  username: string,
): Promise<UserPreferences> {
  const updated = { ...current, username };
  await savePreferences(storage, updated);
  return updated;
}

export async function toggleDarkMode(
  storage: IStorageService,
  current: UserPreferences,
): Promise<UserPreferences> {
  const updated = { ...current, darkMode: !current.darkMode };
  await savePreferences(storage, updated);
  return updated;
}
