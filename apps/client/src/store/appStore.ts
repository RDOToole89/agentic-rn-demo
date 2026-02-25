import { create } from 'zustand';

interface AppState {
  /** Whether the app has finished initial loading */
  isReady: boolean;
  /** Whether onboarding has been completed */
  hasOnboarded: boolean;

  setReady: (ready: boolean) => void;
  setHasOnboarded: (value: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isReady: false,
  hasOnboarded: false,

  setReady: (ready) => set({ isReady: ready }),
  setHasOnboarded: (value) => set({ hasOnboarded: value }),
}));
