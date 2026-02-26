import { View, Text } from '@/tw';
import type { TeamMember, TeamMemberStatus } from '@agentic-rn/core';
import { StatusDot } from './StatusDot';
import { MoodDistribution } from './MoodDistribution';

interface TeamSummaryCardProps {
  members: TeamMember[];
}

function computeTeamVibe(members: TeamMember[]): { emoji: string; label: string } {
  if (members.length === 0) return { emoji: '😶', label: 'No data' };

  const counts = new Map<string, { emoji: string; label: string; count: number }>();
  for (const member of members) {
    const key = member.currentMood.label;
    const existing = counts.get(key);
    if (existing) {
      existing.count++;
    } else {
      counts.set(key, {
        emoji: member.currentMood.emoji,
        label: member.currentMood.label,
        count: 1,
      });
    }
  }

  let dominant = { emoji: '😶', label: 'Mixed', count: 0 };
  for (const entry of counts.values()) {
    if (entry.count > dominant.count) {
      dominant = entry;
    }
  }

  return { emoji: dominant.emoji, label: dominant.label };
}

function countByStatus(members: TeamMember[], status: TeamMemberStatus): number {
  return members.filter((m) => m.status === status).length;
}

export function TeamSummaryCard({ members }: TeamSummaryCardProps) {
  const vibe = computeTeamVibe(members);
  const activeCount = countByStatus(members, 'active');
  const awayCount = countByStatus(members, 'away');
  const offlineCount = countByStatus(members, 'offline');

  return (
    <View className="mx-4 mb-5 p-5 rounded-2xl bg-card shadow-md border-l-4 border-accent">
      {/* Team vibe header */}
      <View className="flex-row items-center gap-3 mb-4">
        <Text className="text-5xl">{vibe.emoji}</Text>
        <View>
          <Text className="text-sm text-text-secondary">Team Vibe</Text>
          <Text className="text-2xl font-bold text-text-primary">{vibe.label}</Text>
        </View>
      </View>

      {/* Mood distribution bar */}
      <View className="mb-4">
        <MoodDistribution members={members} />
      </View>

      {/* Status counts */}
      <View className="flex-row gap-5">
        <View className="flex-row items-center gap-1.5">
          <StatusDot status="active" />
          <Text className="text-sm text-text-secondary">{activeCount} active</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <StatusDot status="away" />
          <Text className="text-sm text-text-secondary">{awayCount} away</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <StatusDot status="offline" />
          <Text className="text-sm text-text-secondary">{offlineCount} offline</Text>
        </View>
      </View>
    </View>
  );
}
