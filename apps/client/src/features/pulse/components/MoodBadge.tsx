import { View, Text } from '@/tw';

interface MoodBadgeProps {
  emoji: string;
  label?: string;
}

export function MoodBadge({ emoji, label }: MoodBadgeProps) {
  return (
    <View className="items-center min-w-[40px]">
      <Text className="text-2xl">{emoji}</Text>
      {label && (
        <Text className="text-xs text-text-secondary mt-0.5">{label}</Text>
      )}
    </View>
  );
}
