import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TaskCard from './TaskCard';

function EmptyState({ icon, title, text }) {
  const { colors } = useTheme();

  return (
    <View style={styles.empty}>
      <MaterialCommunityIcons name={icon} size={56} color={colors.outline} />
      <Text variant="titleMedium" style={{ marginTop: 12, color: colors.onSurface }}>
        {title}
      </Text>
      <Text
        variant="bodyMedium"
        style={{ marginTop: 4, textAlign: 'center', color: colors.onSurfaceVariant }}
      >
        {text}
      </Text>
    </View>
  );
}

export default function TaskList({ tasks, header, emptyIcon, emptyTitle, emptyText }) {
  return (
    <FlatList
      data={tasks}
      keyExtractor={(task) => task.id}
      renderItem={({ item }) => <TaskCard task={item} />}
      ListHeaderComponent={header}
      ListEmptyComponent={
        <EmptyState icon={emptyIcon} title={emptyTitle} text={emptyText} />
      }
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    />
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 110, // espaço para o botão flutuante
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
});
