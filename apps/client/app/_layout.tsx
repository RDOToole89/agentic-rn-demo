import '../src/global.css';

import { useEffect } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../src/api';
import { useThemeSync, useRawColors } from '../src/theme/ThemeContext';
import { usePreferencesStore } from '../src/store/preferencesStore';
import { lightTheme, darkTheme } from '../src/theme/tokens';

function InnerLayout() {
  const { isDark } = useThemeSync();
  const colors = useRawColors();

  return (
    <View className="flex-1" style={isDark ? darkTheme : lightTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          contentStyle: { backgroundColor: colors.surface },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Home' }} />
        <Stack.Screen name="pulse/index" options={{ title: 'Team Pulse' }} />
        <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  const hydrate = usePreferencesStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <QueryClientProvider client={queryClient}>
      <InnerLayout />
    </QueryClientProvider>
  );
}
