/**
 * Storage abstraction — the domain/use-cases depend on this interface,
 * never on a concrete implementation like AsyncStorage.
 */
export interface IStorageService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
}
