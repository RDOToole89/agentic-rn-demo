import { View, Text, ScrollView } from '@/tw';
import { ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { usePreferencesStore } from '../../store/preferencesStore';
import { useTeamMembers } from '../pulse/hooks/useTeamMembers';
import { MoodPicker } from '../pulse/components/MoodPicker';
import { NavigationCard } from './components/NavigationCard';
import { TeamPulseWidget } from './components/TeamPulseWidget';
import { ActivityFeed } from './components/ActivityFeed';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(): string {
  return new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

function SectionHeader({ children }: { children: string }) {
  return (
    <Text className="text-xs font-semibold text-text-secondary tracking-wider uppercase px-5 mb-2">
      {children}
    </Text>
  );
}

export function HomeScreen() {
  const router = useRouter();
  const username = usePreferencesStore((s) => s.username);
  const { members, isLoading } = useTeamMembers();

  return (
    <ScrollView
      className="flex-1 bg-surface"
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      {/* Header */}
      <View className="px-5 pt-8 pb-2">
        <Text className="text-3xl font-bold text-text-primary">
          {getGreeting()}, <Text className="text-accent">{username}</Text>
        </Text>
        <Text className="text-sm text-text-secondary mt-1">{formatDate()}</Text>
      </View>

      {/* Mood check-in */}
      <View className="mt-4">
        <SectionHeader>Your mood</SectionHeader>
        <MoodPicker />
      </View>

      {/* Team Pulse widget */}
      <View className="mt-2">
        <SectionHeader>Team pulse</SectionHeader>
        {isLoading ? (
          <View className="mx-5 p-8 rounded-2xl bg-card shadow-sm items-center">
            <ActivityIndicator />
          </View>
        ) : (
          <View className="mx-5">
            <TeamPulseWidget
              members={members}
              onViewPulse={() => router.push('/pulse')}
            />
          </View>
        )}
      </View>

      {/* Recent Activity */}
      <View className="mt-6">
        <SectionHeader>Recent activity</SectionHeader>
        {isLoading ? (
          <View className="mx-5 p-8 rounded-2xl bg-card shadow-sm items-center">
            <ActivityIndicator />
          </View>
        ) : (
          <View className="mx-5 rounded-2xl bg-card shadow-sm p-3">
            <ActivityFeed members={members} />
          </View>
        )}
      </View>

      {/* Navigation grid */}
      <View className="mt-6">
        <SectionHeader>Quick access</SectionHeader>
        <View className="flex-row gap-3 px-5">
          <NavigationCard
            emoji="🫀"
            title="Team Pulse"
            description="How your team feels"
            accentClass="border-accent"
            compact
            onPress={() => router.push('/pulse')}
          />
          <NavigationCard
            emoji="⚙️"
            title="Settings"
            description="Profile & preferences"
            accentClass="border-accent-secondary"
            compact
            onPress={() => router.push('/settings')}
          />
        </View>
      </View>
    </ScrollView>
  );
}
