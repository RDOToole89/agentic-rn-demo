import { ActivityIndicator } from 'react-native';
import { View, FlatList } from '@/tw';
import type { TeamMember } from '@agentic-rn/core';
import { useRawColors } from '../../theme/ThemeContext';
import { useTeamMembers } from './hooks/useTeamMembers';
import { TeamSummaryCard } from './components/TeamSummaryCard';
import { TeamMemberCard } from './components/TeamMemberCard';

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
    <FlatList<TeamMember>
      className="flex-1 bg-surface"
      contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
      data={members}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <TeamMemberCard member={item} />}
      ListHeaderComponent={<TeamSummaryCard members={members} />}
      refreshing={isRefetching}
      onRefresh={refetch}
    />
  );
}
