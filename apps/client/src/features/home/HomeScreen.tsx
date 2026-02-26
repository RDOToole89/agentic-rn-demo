import { View, Text, Pressable } from '@/tw';
import { useRouter } from 'expo-router';
import { usePreferencesStore } from '../../store/preferencesStore';

export function HomeScreen() {
  const router = useRouter();
  const username = usePreferencesStore((s) => s.username);
  const isDark = usePreferencesStore((s) => s.darkMode);

  return (
    <View className="flex-1 items-center justify-center bg-surface">
      <View className="items-center gap-3">
        <Text className="text-3xl font-bold text-text-primary">Hello, {username}</Text>
        <Text className="text-base text-text-secondary mb-6">
          Theme: {isDark ? 'Dark' : 'Light'} Mode
        </Text>
        <Pressable
          className="px-6 py-3.5 rounded-lg bg-accent"
          onPress={() => router.push('/settings')}
        >
          <Text className="text-base font-semibold text-white">Open Settings</Text>
        </Pressable>
      </View>
    </View>
  );
}
