export interface UserPreferences {
  username: string;
  darkMode: boolean;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  username: 'Guest',
  darkMode: true,
};
