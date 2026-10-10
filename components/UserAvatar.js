import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const initialsOf = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => (word ? word[0].toUpperCase() : ''))
    .join('');

export default function UserAvatar({ photo, name, size = 40 }) {
  const { colors } = useTheme();
  const base = { width: size, height: size, borderRadius: size / 2 };

  if (photo) {
    return (
      <Image
        source={{ uri: photo }}
        style={[
          base,
          {
            borderWidth: size > 70 ? 3 : 2,
            borderColor: colors.primary,
            backgroundColor: colors.surfaceVariant,
          },
        ]}
      />
    );
  }

  const initials = initialsOf(name);

  return (
    <View style={[base, styles.center, { backgroundColor: colors.primaryContainer }]}>
      {initials ? (
        <Text
          style={{
            color: colors.onPrimaryContainer,
            fontWeight: '700',
            fontSize: size * 0.4,
          }}
        >
          {initials}
        </Text>
      ) : (
        <MaterialCommunityIcons
          name="account"
          size={size * 0.62}
          color={colors.onPrimaryContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
});
