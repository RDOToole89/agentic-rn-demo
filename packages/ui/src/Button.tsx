import React from 'react';
import { Pressable, Text, StyleSheet, type ViewStyle } from 'react-native';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  style,
}: ButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      style={[
        styles.base,
        isPrimary ? styles.primary : styles.secondary,
        style,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.label,
          { color: isPrimary ? '#FFFFFF' : '#2563EB' },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: '#2563EB',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});
