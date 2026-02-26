import { View, Text, TextInput, Pressable, ScrollView } from '@/tw';
import { Switch } from 'react-native';
import { useRawColors } from '../../theme/ThemeContext';
import { useSettings } from './hooks/useSettings';

/** Deterministic avatar color from name (same logic as pulse Avatar). */
const AVATAR_COLORS = [
  '#86BC25',
  '#002776',
  '#00A1DE',
  '#578018',
  '#6A88C2',
  '#0088BC',
  '#E6A817',
  '#405F12',
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

function SectionHeader({ title }: { title: string }) {
  return (
    <Text className="text-xs font-semibold uppercase tracking-wider text-text-secondary mx-4 mb-2 mt-6">
      {title}
    </Text>
  );
}

interface SettingRowProps {
  label: string;
  value?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  isLast?: boolean;
}

function SettingRow({ label, value, right, onPress, isLast }: SettingRowProps) {
  const content = (
    <View
      className={`flex-row justify-between items-center px-4 py-3.5 ${isLast ? '' : 'border-b border-border'}`}
    >
      <Text className="text-base text-text-primary">{label}</Text>
      <View className="flex-row items-center gap-2">
        {value && <Text className="text-base text-text-secondary">{value}</Text>}
        {right}
        {onPress && <Text className="text-text-secondary text-sm">›</Text>}
      </View>
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }
  return content;
}

export function SettingsScreen() {
  const colors = useRawColors();
  const { username, darkMode, onUsernameChange, onToggleDarkMode } = useSettings();

  return (
    <ScrollView
      className="flex-1 bg-surface"
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Profile card */}
      <View className="items-center pt-8 pb-6">
        <View
          className="items-center justify-center mb-3"
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: getAvatarColor(username || 'Guest'),
          }}
        >
          <Text className="text-3xl font-bold text-white">
            {getInitials(username || 'Guest')}
          </Text>
        </View>
        <Text className="text-xl font-bold text-text-primary">{username || 'Guest'}</Text>
        <Text className="text-sm text-text-secondary mt-0.5">Team Member</Text>
      </View>

      {/* Account section */}
      <SectionHeader title="Account" />
      <View className="mx-4 rounded-xl bg-card overflow-hidden">
        <View className="px-4 py-3.5 border-b border-border">
          <Text className="text-xs text-text-secondary mb-1.5">Display Name</Text>
          <TextInput
            className="text-base text-text-primary p-0"
            value={username}
            onChangeText={onUsernameChange}
            placeholder="Enter your name"
            placeholderTextColor={colors.textSecondary}
          />
        </View>
        <SettingRow label="Email" value="guest@deloitte.com" isLast />
      </View>

      {/* Appearance section */}
      <SectionHeader title="Appearance" />
      <View className="mx-4 rounded-xl bg-card overflow-hidden">
        <SettingRow
          label="Dark Mode"
          right={
            <Switch
              value={darkMode}
              onValueChange={onToggleDarkMode}
              trackColor={{ false: colors.border, true: colors.accent }}
            />
          }
          isLast={false}
        />
        <SettingRow label="App Icon" value="Default" onPress={() => {}} isLast />
      </View>

      {/* Notifications section */}
      <SectionHeader title="Notifications" />
      <View className="mx-4 rounded-xl bg-card overflow-hidden">
        <SettingRow
          label="Push Notifications"
          right={
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: colors.border, true: colors.accent }}
            />
          }
          isLast={false}
        />
        <SettingRow
          label="Mood Reminders"
          right={
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: colors.border, true: colors.accent }}
            />
          }
          isLast={false}
        />
        <SettingRow label="Reminder Time" value="9:00 AM" onPress={() => {}} isLast />
      </View>

      {/* About section */}
      <SectionHeader title="About" />
      <View className="mx-4 rounded-xl bg-card overflow-hidden">
        <SettingRow label="Version" value="1.0.0" isLast={false} />
        <SettingRow label="Build" value="2026.02.26" isLast={false} />
        <SettingRow label="Privacy Policy" onPress={() => {}} isLast={false} />
        <SettingRow label="Terms of Service" onPress={() => {}} isLast />
      </View>

      {/* Sign out */}
      <View className="mx-4 mt-6 rounded-xl bg-card overflow-hidden">
        <Pressable onPress={() => {}}>
          <View className="py-3.5 items-center">
            <Text className="text-base font-semibold text-error">Sign Out</Text>
          </View>
        </Pressable>
      </View>

      <Text className="text-xs text-text-secondary text-center mt-4">
        Agentic RN Demo — Deloitte Digital
      </Text>
    </ScrollView>
  );
}
