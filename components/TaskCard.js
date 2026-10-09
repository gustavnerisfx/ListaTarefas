import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Button,
  Checkbox,
  Dialog,
  Portal,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTasks } from '../context/TasksContext';
import { formatDateTime, isOverdue, relativeDue } from '../utils/taskUtils';

export default function TaskCard({ task }) {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { now, toggleTask, removeTask } = useTasks();
  const [expanded, setExpanded] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const overdue = isOverdue(task, now);
  const accent = overdue ? colors.error : colors.onSurfaceVariant;

  let dueText = 'Sem data de vencimento';
  if (task.dueAt != null) {
    dueText = task.done
      ? formatDateTime(task.dueAt)
      : `${formatDateTime(task.dueAt)} · ${relativeDue(task.dueAt, now)}`;
  }

  return (
    <>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: overdue ? colors.error : colors.outlineVariant,
          },
        ]}
      >
        {/* Cabeçalho: toque para expandir/recolher */}
        <TouchableRipple onPress={() => setExpanded((v) => !v)}>
          <View style={styles.header}>
            <Checkbox
              status={task.done ? 'checked' : 'unchecked'}
              onPress={() => toggleTask(task.id)}
              color={colors.primary}
            />

            <View style={styles.titleBox}>
              <Text
                variant="titleMedium"
                numberOfLines={expanded ? undefined : 1}
                style={task.done ? styles.doneText : { color: colors.onSurface }}
              >
                {task.title}
              </Text>

              {task.dueAt != null && (
                <View style={styles.meta}>
                  <MaterialCommunityIcons name="clock-outline" size={14} color={accent} />
                  <Text variant="bodySmall" style={{ color: accent, marginLeft: 4 }}>
                    {formatDateTime(task.dueAt)}
                  </Text>
                </View>
              )}
            </View>

            {overdue && (
              <View style={[styles.badge, { backgroundColor: colors.errorContainer }]}>
                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  size={14}
                  color={colors.onErrorContainer}
                />
                <Text
                  variant="labelSmall"
                  style={{ color: colors.onErrorContainer, marginLeft: 4, fontWeight: '700' }}
                >
                  Vencida
                </Text>
              </View>
            )}

            <MaterialCommunityIcons
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={colors.onSurfaceVariant}
              style={styles.chevron}
            />
          </View>
        </TouchableRipple>

        {/* Detalhes */}
        {expanded && (
          <View style={[styles.details, { borderTopColor: colors.outlineVariant }]}>
            <Text variant="labelMedium" style={{ color: colors.onSurfaceVariant }}>
              DESCRIÇÃO
            </Text>
            <Text
              variant="bodyMedium"
              style={{
                marginTop: 4,
                color: task.description ? colors.onSurface : colors.onSurfaceVariant,
                fontStyle: task.description ? 'normal' : 'italic',
              }}
            >
              {task.description || 'Sem descrição'}
            </Text>

            <Text variant="labelMedium" style={[styles.label, { color: colors.onSurfaceVariant }]}>
              VENCIMENTO
            </Text>
            <Text
              variant="bodyMedium"
              style={{ marginTop: 4, color: overdue ? colors.error : colors.onSurface }}
            >
              {dueText}
            </Text>

            {task.done && task.doneAt != null && (
              <>
                <Text
                  variant="labelMedium"
                  style={[styles.label, { color: colors.onSurfaceVariant }]}
                >
                  CONCLUÍDA EM
                </Text>
                <Text variant="bodyMedium" style={{ marginTop: 4, color: colors.onSurface }}>
                  {formatDateTime(task.doneAt)}
                </Text>
              </>
            )}

            <View style={styles.actions}>
              <Button
                mode="outlined"
                icon="pencil-outline"
                onPress={() => navigation.navigate('TaskForm', { taskId: task.id })}
              >
                Editar
              </Button>
              <Button
                mode="text"
                icon="delete-outline"
                textColor={colors.error}
                onPress={() => setConfirmVisible(true)}
              >
                Excluir
              </Button>
            </View>
          </View>
        )}
      </View>

      {confirmVisible && (
        <Portal>
          <Dialog visible onDismiss={() => setConfirmVisible(false)}>
            <Dialog.Title>Excluir tarefa?</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">
                "{task.title}" será removida permanentemente.
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setConfirmVisible(false)}>Cancelar</Button>
              <Button
                textColor={colors.error}
                onPress={() => {
                  setConfirmVisible(false);
                  removeTask(task.id);
                }}
              >
                Excluir
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 6,
    paddingRight: 8,
  },
  titleBox: {
    flex: 1,
    marginLeft: 4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  doneText: {
    textDecorationLine: 'line-through',
    opacity: 0.55,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 8,
  },
  chevron: {
    marginLeft: 6,
  },
  details: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  label: {
    marginTop: 14,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
});
