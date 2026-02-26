import { View } from '@/tw';
import { cn } from '@/tw';
import type { TeamMemberStatus } from '@agentic-rn/core';

const STATUS_CLASS: Record<TeamMemberStatus, string> = {
  active: 'bg-success',
  away: 'bg-warning',
  offline: 'bg-neutral-400',
};

interface StatusDotProps {
  status: TeamMemberStatus;
}

export function StatusDot({ status }: StatusDotProps) {
  return <View className={cn('w-2 h-2 rounded-full', STATUS_CLASS[status])} />;
}
