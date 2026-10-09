import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, FAB, useTheme } from 'react-native-paper';
import { useTasks } from '../context/TasksContext';
import TaskList from '../components/TaskList';
import StatTile from '../components/StatTile';
import { isOverdue, sortPending } from '../utils/taskUtils';

export default function PendingScreen({ navigation }) {
  const { colors } = useTheme();
  const { tasks, now, loaded } = useTasks();

  const pending = useMemo(
    () => sortPending(tasks.filter((t) => !t.done), now),
    [tasks, now]
  );
  const overdueCount = pending.filter((t) => isOverdue(t, now)).length;

  if (!loaded) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator />
      </View>
    );
  }

  const header = (
    <View style={styles.stats}>
      <StatTile
        value={pending.length}
        label="Pendentes"
        backgroundColor={colors.primaryContainer}
        color={colors.onPrimaryContainer}
      />
      <View style={{ width: 12 }} />
      <StatTile
        value={overdueCount}
        label="Vencidas"
        backgroundColor={overdueCount > 0 ? colors.errorContainer : colors.surfaceVariant}
        color={overdueCount > 0 ? colors.onErrorContainer : colors.onSurfaceVariant}
      />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TaskList
        tasks={pending}
        header={header}
        emptyIcon="check-all"
        emptyTitle="Tudo em dia!"
        emptyText={'Toque em "Nova tarefa" para criar a primeira.'}
      />
      <FAB
        icon="plus"
        label="Nova tarefa"
        color={colors.onPrimary}
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('TaskForm')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  stats: { flexDirection: 'row', marginBottom: 20 },
  fab: { position: 'absolute', right: 16, bottom: 16, borderRadius: 18 },
});
