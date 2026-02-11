/**
 * Core domain entity — no framework dependencies.
 * This is the single source of truth for user preferences shape.
 */
export interface UserPreferences {
  username: string;
  darkMode: boolean;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  username: 'Guest',
  darkMode: false,
};
