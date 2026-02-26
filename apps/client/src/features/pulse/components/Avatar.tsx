import { View, Text } from '@/tw';

const AVATAR_COLORS = [
  '#86BC25', // green
  '#002776', // blue
  '#00A1DE', // cyan
  '#578018', // dark green
  '#6A88C2', // light blue
  '#0088BC', // dark cyan
  '#E6A817', // amber
  '#405F12', // forest
];

function getInitials(name: string): string {
  const parts = name.split(' ').filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

interface AvatarProps {
  name: string;
  size?: number;
}

export function Avatar({ name, size = 48 }: AvatarProps) {
  const fontSize = size * 0.4;

  return (
    <View
      className="items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: getAvatarColor(name),
      }}
    >
      <Text className="font-bold text-white" style={{ fontSize }}>
        {getInitials(name)}
      </Text>
    </View>
  );
}
