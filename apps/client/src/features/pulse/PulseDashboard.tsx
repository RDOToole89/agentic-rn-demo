import { ActivityIndicator, RefreshControl } from 'react-native';
import { View, ScrollView, Text } from '@/tw';
import { useRawColors } from '../../theme/ThemeContext';
import { useTeamMembers } from './hooks/useTeamMembers';
import { TeamSummaryCard } from './components/TeamSummaryCard';
import { TeamMemberCard } from './components/TeamMemberCard';
import { MoodPicker } from './components/MoodPicker';
import { StandupCard } from './components/StandupCard';

export function PulseDashboard() {
  const { members, isLoading, isRefetching, refetch } = useTeamMembers();
  const colors = useRawColors();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-surface"
      contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor={colors.accent}
        />
      }
    >
      <TeamSummaryCard members={members} />

      <Text className="text-xs font-semibold text-text-secondary uppercase tracking-wider mx-4 mb-2">
        Your Mood
      </Text>
      <MoodPicker />

      <Text className="text-xs font-semibold text-text-secondary uppercase tracking-wider mx-4 mb-2">
        AI Standup
      </Text>
      <StandupCard members={members} />

      <Text className="text-xs font-semibold text-text-secondary uppercase tracking-wider mx-4 mb-2">
        Team Members
      </Text>
      {members.map((member) => (
        <TeamMemberCard key={member.id} member={member} />
      ))}
    </ScrollView>
  );
}
