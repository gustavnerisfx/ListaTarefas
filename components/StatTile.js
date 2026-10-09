import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

export default function StatTile({ value, label, backgroundColor, color }) {
  return (
    <View style={[styles.tile, { backgroundColor }]}>
      <Text variant="headlineMedium" style={{ color, fontWeight: '700' }}>
        {value}
      </Text>
      <Text variant="labelLarge" style={{ color }}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
});
