import { View, Text, Pressable } from '@/tw';
import { cn } from '@/tw';

interface NavigationCardProps {
  emoji: string;
  title: string;
  description: string;
  accentClass?: string;
  onPress: () => void;
}

export function NavigationCard({
  emoji,
  title,
  description,
  accentClass = 'border-accent',
  onPress,
}: NavigationCardProps) {
  return (
    <Pressable
      className={cn(
        'flex-row items-center p-4 rounded-xl bg-card shadow-sm border-l-4',
        accentClass,
      )}
      onPress={onPress}
    >
      <Text className="text-3xl mr-4">{emoji}</Text>
      <View className="flex-1">
        <Text className="text-base font-bold text-text-primary">{title}</Text>
        <Text className="text-sm text-text-secondary mt-0.5">
          {description}
        </Text>
      </View>
      <Text className="text-xl text-text-muted">›</Text>
    </Pressable>
  );
}
