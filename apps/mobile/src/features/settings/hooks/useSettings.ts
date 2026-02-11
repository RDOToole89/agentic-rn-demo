import { useCallback, useState, useEffect } from 'react';
import { usePreferencesStore } from '../../../shared/store/preferencesStore';

/**
 * Feature-level hook — encapsulates all Settings screen logic.
 * Debounces username writes to avoid excessive persistence calls.
 */
export function useSettings() {
  const storeUsername = usePreferencesStore((s) => s.username);
  const darkMode = usePreferencesStore((s) => s.darkMode);
  const setUsername = usePreferencesStore((s) => s.setUsername);
  const toggle = usePreferencesStore((s) => s.toggleDarkMode);

  const [localUsername, setLocalUsername] = useState(storeUsername);

  useEffect(() => {
    setLocalUsername(storeUsername);
  }, [storeUsername]);

  useEffect(() => {
    if (localUsername === storeUsername) return;
    const timer = setTimeout(() => {
      setUsername(localUsername);
    }, 500);
    return () => clearTimeout(timer);
  }, [localUsername, storeUsername, setUsername]);

  const onUsernameChange = useCallback((text: string) => {
    setLocalUsername(text);
  }, []);

  const onToggleDarkMode = useCallback(() => {
    toggle();
  }, [toggle]);

  return {
    username: localUsername,
    darkMode,
    onUsernameChange,
    onToggleDarkMode,
  };
}
