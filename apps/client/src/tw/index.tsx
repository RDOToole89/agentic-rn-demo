/**
 * NativeWind component re-exports and utilities.
 *
 * In NativeWind v5, core React Native components support `className` via the
 * JSX transform — no manual wrappers needed. This module provides:
 *
 * 1. A single import point for styled components (`import { View, Text } from '@/tw'`)
 * 2. The `cn()` utility for conditional/merged class names
 * 3. `cssInterop` re-export for wrapping third-party components
 *
 * Usage:
 *   import { View, Text, cn } from '@/tw';
 *   <View className={cn('flex-1', isActive && 'bg-accent')} />
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  FlatList,
  Image,
} from 'react-native';

export { cssInterop } from 'nativewind';

/** Merge Tailwind classes with conflict resolution. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
