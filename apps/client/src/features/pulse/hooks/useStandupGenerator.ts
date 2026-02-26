import { useState, useCallback, useRef, useEffect } from 'react';
import type { TeamMember } from '@agentic-rn/core';
import { generateStandup } from '../utils/generateStandup';

interface UseStandupGeneratorReturn {
  summary: string | null;
  isGenerating: boolean;
  generate: () => void;
  regenerate: () => void;
}

export function useStandupGenerator(members: TeamMember[]): UseStandupGeneratorReturn {
  const [summary, setSummary] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const variationRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runGeneration = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    setIsGenerating(true);
    setSummary(null);

    timerRef.current = setTimeout(() => {
      const result = generateStandup(members, variationRef.current);
      setSummary(result);
      setIsGenerating(false);
      timerRef.current = null;
    }, 1500);
  }, [members]);

  const generate = useCallback(() => {
    runGeneration();
  }, [runGeneration]);

  const regenerate = useCallback(() => {
    variationRef.current++;
    runGeneration();
  }, [runGeneration]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { summary, isGenerating, generate, regenerate };
}
