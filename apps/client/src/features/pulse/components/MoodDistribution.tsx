import { View, Text } from '@/tw';
import type { TeamMember } from '@agentic-rn/core';

const MOOD_COLORS: Record<string, string> = {
  Happy: '#86BC25',
  'Fired Up': '#E6A817',
  Neutral: '#A8A8A0',
  Thinking: '#00A1DE',
  Tired: '#6A88C2',
  Stressed: '#D42828',
};

export function getMoodColor(label: string): string {
  return MOOD_COLORS[label] ?? '#A8A8A0';
}

interface MoodDistributionProps {
  members: TeamMember[];
}

export function MoodDistribution({ members }: MoodDistributionProps) {
  if (members.length === 0) return null;

  const counts = new Map<string, { label: string; emoji: string; count: number }>();
  for (const member of members) {
    const key = member.currentMood.label;
    const existing = counts.get(key);
    if (existing) {
      existing.count++;
    } else {
      counts.set(key, {
        label: key,
        emoji: member.currentMood.emoji,
        count: 1,
      });
    }
  }

  const segments = Array.from(counts.values()).sort((a, b) => b.count - a.count);
  const total = members.length;

  return (
    <View>
      {/* Stacked bar */}
      <View className="flex-row h-3 rounded-full overflow-hidden mb-3">
        {segments.map((segment) => (
          <View
            key={segment.label}
            style={{
              flex: segment.count / total,
              backgroundColor: getMoodColor(segment.label),
            }}
          />
        ))}
      </View>

      {/* Labels */}
      <View className="flex-row flex-wrap gap-x-4 gap-y-1">
        {segments.map((segment) => (
          <View key={segment.label} className="flex-row items-center gap-1.5">
            <View
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: getMoodColor(segment.label) }}
            />
            <Text className="text-xs text-text-secondary">
              {segment.emoji} {segment.count}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
