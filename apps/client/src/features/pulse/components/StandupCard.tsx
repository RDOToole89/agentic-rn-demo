import { useEffect, useRef, useState } from 'react';
import { LayoutAnimation, Platform, UIManager } from 'react-native';
import { View, Text, Pressable } from '@/tw';
import type { TeamMember } from '@agentic-rn/core';
import { useStandupGenerator } from '../hooks/useStandupGenerator';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface StandupCardProps {
  members: TeamMember[];
}

function LoadingDots() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <Text className="text-sm text-text-secondary">🤖 Analyzing team moods{dots}</Text>
  );
}

export function StandupCard({ members }: StandupCardProps) {
  const { summary, isGenerating, generate, regenerate } = useStandupGenerator(members);
  const currentState = isGenerating ? 'loading' : summary !== null ? 'summary' : 'idle';
  const prevStateRef = useRef(currentState);

  useEffect(() => {
    if (currentState !== prevStateRef.current) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      prevStateRef.current = currentState;
    }
  }, [currentState]);

  return (
    <View className="mx-4 mb-5 p-5 rounded-2xl bg-card shadow-sm border-l-4 border-accent">
      {currentState === 'idle' && (
        <Pressable onPress={generate}>
          <Text className="text-base font-semibold text-accent text-center">
            🤖 Generate AI Standup
          </Text>
        </Pressable>
      )}

      {currentState === 'loading' && (
        <View className="items-center py-2">
          <LoadingDots />
        </View>
      )}

      {currentState === 'summary' && summary !== null && (
        <View>
          <Text className="text-sm text-text-primary leading-6">{summary}</Text>
          <Pressable onPress={regenerate} className="mt-3">
            <Text className="text-sm text-accent font-medium">↻ Regenerate</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
