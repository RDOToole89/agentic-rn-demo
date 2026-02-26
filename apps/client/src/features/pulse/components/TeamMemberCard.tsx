import { useState } from 'react';
import { LayoutAnimation, Platform, UIManager } from 'react-native';
import { View, Text, Pressable } from '@/tw';
import type { TeamMember } from '@agentic-rn/core';
import { Avatar } from './Avatar';
import { StatusDot } from './StatusDot';
import { MoodBadge } from './MoodBadge';
import { getMoodColor } from './MoodDistribution';
import { formatRelativeTime } from '../utils/formatTime';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface TeamMemberCardProps {
  member: TeamMember;
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  const [expanded, setExpanded] = useState(false);
  const moodColor = getMoodColor(member.currentMood.label);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  };

  const lastCheckIn = formatRelativeTime(member.currentMood.timestamp);

  return (
    <Pressable onPress={toggle}>
      <View
        className="mx-4 mb-3 rounded-xl bg-card shadow-sm overflow-hidden"
        style={{ borderLeftWidth: 4, borderLeftColor: moodColor }}
      >
        {/* Main row */}
        <View className="flex-row items-center p-4">
          <Avatar name={member.name} size={52} />
          <View className="flex-1 ml-3">
            <Text className="text-base font-bold text-text-primary">{member.name}</Text>
            <View className="flex-row items-center gap-1.5 mt-0.5">
              <StatusDot status={member.status} />
              <Text className="text-sm text-text-secondary">{member.role}</Text>
            </View>
          </View>
          <MoodBadge emoji={member.currentMood.emoji} label={member.currentMood.label} />
          <Text className="text-text-secondary ml-2">{expanded ? '▲' : '▼'}</Text>
        </View>

        {/* Expanded mood timeline */}
        {expanded && (
          <View className="px-4 pb-4 pt-1">
            <View className="border-t border-border pt-3">
              <Text className="text-xs text-text-secondary mb-2">
                Last check-in: {lastCheckIn}
              </Text>

              {member.moodHistory.length > 0 ? (
                <View className="ml-1">
                  {member.moodHistory.map((entry, index) => (
                    <View
                      key={`${entry.timestamp}-${index}`}
                      className="flex-row items-center mb-2"
                    >
                      <View
                        className="w-2 h-2 rounded-full mr-3"
                        style={{ backgroundColor: getMoodColor(entry.label) }}
                      />
                      <Text className="text-sm mr-2">{entry.emoji}</Text>
                      <Text className="text-sm text-text-primary flex-1">
                        {entry.label}
                      </Text>
                      <Text className="text-xs text-text-secondary">
                        {formatRelativeTime(entry.timestamp)}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text className="text-xs text-text-secondary italic">
                  No mood history
                </Text>
              )}
            </View>
          </View>
        )}
      </View>
    </Pressable>
  );
}
