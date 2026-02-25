import { View, Text, TextInput } from '@/tw';
import { Switch } from 'react-native';
import { useRawColors } from '../../theme/ThemeContext';
import { useSettings } from './hooks/useSettings';

export function SettingsScreen() {
  const colors = useRawColors();
  const { username, darkMode, onUsernameChange, onToggleDarkMode } =
    useSettings();

  return (
    <View className="flex-1 p-5 gap-4 bg-surface">
      <View className="p-4 rounded-lg bg-surface-elevated">
        <Text className="text-xs font-semibold uppercase tracking-wide mb-2 text-text-secondary">
          Username
        </Text>
        <TextInput
          className="text-base p-3 border rounded-md border-border bg-input text-text-primary"
          value={username}
          onChangeText={onUsernameChange}
          placeholder="Enter your name"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <View className="p-4 rounded-lg bg-surface-elevated">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-xs font-semibold uppercase tracking-wide mb-2 text-text-secondary">
              Dark Mode
            </Text>
            <Text className="text-base font-medium text-text-primary">
              {darkMode ? 'On' : 'Off'}
            </Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={onToggleDarkMode}
            trackColor={{ false: colors.border, true: colors.accent }}
          />
        </View>
      </View>
    </View>
  );
}
