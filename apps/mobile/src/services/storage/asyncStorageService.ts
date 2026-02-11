import AsyncStorage from '@react-native-async-storage/async-storage';
import type { IStorageService } from '../interfaces/IStorageService';

/**
 * Concrete implementation of IStorageService using AsyncStorage.
 * This is the only file in the project that imports AsyncStorage directly.
 */
export const asyncStorageService: IStorageService = {
  async get<T>(key: string): Promise<T | null> {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  },

  async set<T>(key: string, value: T): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },

  async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },
};
