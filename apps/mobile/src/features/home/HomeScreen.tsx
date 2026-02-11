import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../theme/ThemeContext';
import { usePreferencesStore } from '../../shared/store/preferencesStore';

export function HomeScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const username = usePreferencesStore((s) => s.username);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.greeting, { color: colors.text }]}>
          Hello, {username}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Theme: {isDark ? 'Dark' : 'Light'} Mode
        </Text>

        <Pressable
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/settings')}
        >
          <Text style={[styles.buttonText, { color: colors.primaryText }]}>
            Open Settings
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 12,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
