import { View, Text } from '@/tw';
import type { TeamMember } from '@agentic-rn/core';
import { Avatar } from './Avatar';
import { StatusDot } from './StatusDot';
import { MoodBadge } from './MoodBadge';

interface TeamMemberCardProps {
  member: TeamMember;
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <View className="flex-row items-center p-4 mx-4 mb-3 rounded-xl bg-card shadow-sm">
      <Avatar name={member.name} size={48} />
      <View className="flex-1 ml-3">
        <Text className="text-base font-bold text-text-primary">{member.name}</Text>
        <View className="flex-row items-center gap-1.5 mt-0.5">
          <StatusDot status={member.status} />
          <Text className="text-sm text-text-secondary">{member.role}</Text>
        </View>
      </View>
      <MoodBadge emoji={member.currentMood.emoji} label={member.currentMood.label} />
    </View>
  );
}
