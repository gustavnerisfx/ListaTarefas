import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, HelperText, Text, TextInput, useTheme } from 'react-native-paper';
import {
  DatePickerModal,
  TimePickerModal,
  registerTranslation,
  pt,
} from 'react-native-paper-dates';
import { useTasks } from '../context/TasksContext';
import { formatDate, formatTime, mergeDate, mergeTime } from '../utils/taskUtils';

registerTranslation('pt', pt);

export default function TaskFormScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { tasks, addTask, updateTask } = useTasks();

  const taskId = route.params?.taskId;
  const editing = tasks.find((t) => t.id === taskId);

  const [title, setTitle] = useState(editing?.title ?? '');
  const [description, setDescription] = useState(editing?.description ?? '');
  const [dueAt, setDueAt] = useState(editing?.dueAt ?? null);
  const [dateOpen, setDateOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!title.trim()) {
      setError('Dê um título para a tarefa.');
      return;
    }

    const data = { title: title.trim(), description: description.trim(), dueAt };
    if (editing) updateTask(editing.id, data);
    else addTask(data);

    navigation.goBack();
  };

  const alreadyPassed = dueAt != null && dueAt < Date.now();

  return (
    <>
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          mode="outlined"
          label="Título"
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            if (error) setError('');
          }}
          error={!!error}
          maxLength={80}
          autoFocus={!editing}
        />
        <HelperText type="error" visible={!!error}>
          {error}
        </HelperText>

        <TextInput
          mode="outlined"
          label="Descrição (opcional)"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={styles.description}
        />

        <Text variant="titleSmall" style={[styles.sectionLabel, { color: colors.onSurface }]}>
          Vencimento (opcional)
        </Text>

        <View style={styles.row}>
          <Button
            mode="outlined"
            icon="calendar"
            style={styles.flex}
            onPress={() => setDateOpen(true)}
          >
            {dueAt != null ? formatDate(dueAt) : 'Data'}
          </Button>
          <View style={{ width: 12 }} />
          <Button
            mode="outlined"
            icon="clock-outline"
            style={styles.flex}
            onPress={() => setTimeOpen(true)}
          >
            {dueAt != null ? formatTime(dueAt) : 'Hora'}
          </Button>
        </View>

        {dueAt != null && (
          <Button
            mode="text"
            icon="close"
            compact
            style={styles.clear}
            onPress={() => setDueAt(null)}
          >
            Remover vencimento
          </Button>
        )}

        <HelperText type="error" visible={alreadyPassed}>
          Esse horário já passou: a tarefa será salva como vencida.
        </HelperText>

        <Button
          mode="contained"
          icon="check"
          onPress={handleSave}
          style={styles.save}
          contentStyle={styles.saveContent}
        >
          {editing ? 'Salvar alterações' : 'Criar tarefa'}
        </Button>
        <Button mode="text" onPress={() => navigation.goBack()} style={{ marginTop: 4 }}>
          Cancelar
        </Button>
      </ScrollView>

      <DatePickerModal
        locale="pt"
        mode="single"
        visible={dateOpen}
        onDismiss={() => setDateOpen(false)}
        date={dueAt != null ? new Date(dueAt) : undefined}
        onConfirm={({ date }) => {
          setDateOpen(false);
          if (date) setDueAt(mergeDate(dueAt, date));
        }}
        label="Selecionar data"
        saveLabel="Confirmar"
      />

      <TimePickerModal
        visible={timeOpen}
        onDismiss={() => setTimeOpen(false)}
        hours={dueAt != null ? new Date(dueAt).getHours() : 9}
        minutes={dueAt != null ? new Date(dueAt).getMinutes() : 0}
        use24HourClock
        label="Selecionar hora"
        cancelLabel="Cancelar"
        confirmLabel="Confirmar"
        onConfirm={({ hours, minutes }) => {
          setTimeOpen(false);
          setDueAt(mergeTime(dueAt, hours, minutes));
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 40 },
  description: { minHeight: 110 },
  sectionLabel: { marginTop: 20, marginBottom: 10, fontWeight: '600' },
  row: { flexDirection: 'row' },
  flex: { flex: 1 },
  clear: { alignSelf: 'flex-start', marginTop: 6 },
  save: { marginTop: 16, borderRadius: 14 },
  saveContent: { paddingVertical: 6 },
});
