import { View, Text } from '@/tw';
import type { TeamMember } from '@agentic-rn/core';
import { Avatar } from '../../pulse/components/Avatar';
import { getMoodColor } from '../../pulse/components/MoodDistribution';
import { formatRelativeTime } from '../../pulse/utils/formatTime';

interface ActivityFeedProps {
  members: TeamMember[];
}

interface ActivityItem {
  memberId: string;
  memberName: string;
  emoji: string;
  label: string;
  timestamp: string;
}

function getRecentActivity(members: TeamMember[], limit = 5): ActivityItem[] {
  const items: ActivityItem[] = members.map((member) => ({
    memberId: member.id,
    memberName: member.name,
    emoji: member.currentMood.emoji,
    label: member.currentMood.label,
    timestamp: member.currentMood.timestamp,
  }));

  return items
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

export function ActivityFeed({ members }: ActivityFeedProps) {
  const activities = getRecentActivity(members);

  if (activities.length === 0) return null;

  return (
    <View className="gap-1">
      {activities.map((activity) => (
        <View key={activity.memberId} className="flex-row items-center p-3 rounded-xl">
          <View
            className="w-1 self-stretch rounded-full mr-3"
            style={{ backgroundColor: getMoodColor(activity.label) }}
          />
          <Avatar name={activity.memberName} size={32} />
          <View className="flex-1 ml-3">
            <Text className="text-sm font-medium text-text-primary">
              {activity.memberName.split(' ')[0]}
            </Text>
            <Text className="text-xs text-text-secondary">
              {activity.label} {activity.emoji}
            </Text>
          </View>
          <Text className="text-xs text-text-muted">
            {formatRelativeTime(activity.timestamp)}
          </Text>
        </View>
      ))}
    </View>
  );
}
