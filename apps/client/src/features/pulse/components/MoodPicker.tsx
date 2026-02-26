import { View, Text, Pressable, cn } from '@/tw';
import { useMoodSubmit } from '../hooks/useMoodSubmit';

const MOOD_OPTIONS = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '🔥', label: 'Fired Up' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '🤔', label: 'Thinking' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '😤', label: 'Stressed' },
] as const;

export function MoodPicker() {
  const { selectedMood, isConfirming, submitMood } = useMoodSubmit();

  return (
    <View className="mx-4 mb-5 p-5 rounded-2xl bg-card shadow-sm">
      <Text className="text-sm font-semibold text-text-secondary mb-3">
        How are you feeling?
      </Text>

      <View className="flex-row justify-between">
        {MOOD_OPTIONS.map((option) => {
          const isSelected = selectedMood?.emoji === option.emoji;
          return (
            <Pressable
              key={option.emoji}
              onPress={() => submitMood(option.emoji, option.label)}
              className={cn(
                'items-center rounded-xl px-2 py-2',
                isSelected && 'bg-accent/10',
              )}
            >
              <View
                className={cn(
                  'w-12 h-12 items-center justify-center rounded-full',
                  isSelected && 'border-2 border-accent',
                )}
              >
                <Text className={cn('text-2xl', isSelected && 'text-3xl')}>
                  {option.emoji}
                </Text>
              </View>
              <Text
                className={cn(
                  'text-xs mt-1',
                  isSelected ? 'text-accent font-semibold' : 'text-text-secondary',
                )}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {isConfirming && (
        <Text className="text-sm text-accent font-medium text-center mt-3">
          Mood updated!
        </Text>
      )}
    </View>
  );
}
