import { View, Text, TextInput, Switch, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useSettings } from './hooks/useSettings';

export function SettingsScreen() {
  const { colors } = useTheme();
  const { username, darkMode, onUsernameChange, onToggleDarkMode } =
    useSettings();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Username
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              borderColor: colors.border,
              backgroundColor: colors.card,
            },
          ]}
          value={username}
          onChangeText={onUsernameChange}
          placeholder="Enter your name"
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <View style={styles.row}>
          <View>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Dark Mode
            </Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {darkMode ? 'On' : 'Off'}
            </Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={onToggleDarkMode}
            trackColor={{ false: colors.border, true: colors.primary }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
});
