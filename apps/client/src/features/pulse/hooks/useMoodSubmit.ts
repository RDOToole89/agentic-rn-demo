import { useState, useCallback, useRef } from 'react';

interface MoodOption {
  emoji: string;
  label: string;
}

interface UseMoodSubmitReturn {
  selectedMood: MoodOption | null;
  isConfirming: boolean;
  submitMood: (emoji: string, label: string) => void;
}

export function useMoodSubmit(): UseMoodSubmitReturn {
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const submitMood = useCallback((emoji: string, label: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    setSelectedMood({ emoji, label });
    setIsConfirming(true);

    timerRef.current = setTimeout(() => {
      setIsConfirming(false);
      timerRef.current = null;
    }, 2000);
  }, []);

  return { selectedMood, isConfirming, submitMood };
}
