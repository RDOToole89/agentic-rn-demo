import { View, Text, ScrollView } from '@/tw';
import { useRouter } from 'expo-router';
import { usePreferencesStore } from '../../store/preferencesStore';
import { NavigationCard } from './components/NavigationCard';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function HomeScreen() {
  const router = useRouter();
  const username = usePreferencesStore((s) => s.username);

  return (
    <ScrollView
      className="flex-1 bg-surface"
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <View className="px-5 pt-8 pb-6">
        <Text className="text-3xl font-bold text-text-primary">
          {getGreeting()}, <Text className="text-accent">{username}</Text>
        </Text>
        <Text className="text-base text-text-secondary mt-1">
          Here's what's happening with your team.
        </Text>
      </View>

      <View className="px-5 gap-4">
        <NavigationCard
          emoji="🫀"
          title="Team Pulse"
          description="See how your team is feeling today"
          accentClass="border-accent"
          onPress={() => router.push('/pulse')}
        />
        <NavigationCard
          emoji="⚙️"
          title="Settings"
          description="Manage your profile and preferences"
          accentClass="border-accent-secondary"
          onPress={() => router.push('/settings')}
        />
      </View>
    </ScrollView>
  );
}
