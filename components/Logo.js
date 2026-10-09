import React from 'react';
import { Image, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export default function Logo({ size = 32, showText = true }) {
  const { colors } = useTheme();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Image
        source={require('../assets/logo.png')}
        style={{ width: size, height: size, borderRadius: size * 0.22 }}
      />
      {showText && (
        <Text
          variant={size > 40 ? 'headlineSmall' : 'titleLarge'}
          style={{ marginLeft: 10, fontWeight: '700', color: colors.onSurface }}
        >
          Minhas Tarefas
        </Text>
      )}
    </View>
  );
}
