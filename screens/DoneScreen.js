import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { useTasks } from '../context/TasksContext';
import TaskList from '../components/TaskList';
import StatTile from '../components/StatTile';
import { sortDone } from '../utils/taskUtils';

export default function DoneScreen() {
  const { colors } = useTheme();
  const { tasks, loaded } = useTasks();

  const done = useMemo(() => sortDone(tasks.filter((t) => t.done)), [tasks]);

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
        value={done.length}
        label="Concluídas"
        backgroundColor={colors.primaryContainer}
        color={colors.onPrimaryContainer}
      />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TaskList
        tasks={done}
        header={header}
        emptyIcon="clipboard-check-outline"
        emptyTitle="Nada concluído ainda"
        emptyText="Marque uma tarefa como feita e ela aparece aqui."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  stats: { flexDirection: 'row', marginBottom: 20 },
});
