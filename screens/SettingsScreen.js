import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Dialog, List, Portal, Switch, Text, useTheme } from 'react-native-paper';
import { useAppTheme } from '../context/ThemeContext';
import { useTasks } from '../context/TasksContext';
import Logo from '../components/Logo';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const { isDark, setDarkMode } = useAppTheme();
  const { tasks, clearDone } = useTasks();
  const [confirmVisible, setConfirmVisible] = useState(false);

  const doneCount = tasks.filter((t) => t.done).length;
  const sectionStyle = [
    styles.section,
    { backgroundColor: colors.surface, borderColor: colors.outlineVariant },
  ];

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
    >
      <View style={[styles.about, ...sectionStyle]}>
        <Logo size={56} />
        <Text variant="bodySmall" style={{ marginTop: 8, color: colors.onSurfaceVariant }}>
          Versão 1.0.0
        </Text>
      </View>

      <List.Subheader style={{ color: colors.primary }}>Aparência</List.Subheader>
      <View style={sectionStyle}>
        <List.Item
          title="Modo escuro"
          description={isDark ? 'Tema escuro ativado' : 'Tema claro ativado'}
          left={(props) => (
            <List.Icon
              {...props}
              icon={isDark ? 'weather-night' : 'white-balance-sunny'}
            />
          )}
          right={() => <Switch value={isDark} onValueChange={setDarkMode} />}
          onPress={() => setDarkMode(!isDark)}
        />
      </View>

      <List.Subheader style={{ color: colors.primary }}>Dados</List.Subheader>
      <View style={sectionStyle}>
        <List.Item
          title="Apagar tarefas concluídas"
          description={
            doneCount === 0
              ? 'Nenhuma tarefa concluída'
              : `${doneCount} ${doneCount === 1 ? 'tarefa concluída' : 'tarefas concluídas'}`
          }
          left={(props) => <List.Icon {...props} icon="delete-sweep-outline" />}
          disabled={doneCount === 0}
          onPress={() => setConfirmVisible(true)}
        />
      </View>

      {confirmVisible && (
        <Portal>
          <Dialog visible onDismiss={() => setConfirmVisible(false)}>
            <Dialog.Title>Apagar concluídas?</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">
                Todas as tarefas concluídas serão removidas permanentemente.
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setConfirmVisible(false)}>Cancelar</Button>
              <Button
                textColor={colors.error}
                onPress={() => {
                  setConfirmVisible(false);
                  clearDone();
                }}
              >
                Apagar
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 40 },
  section: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  about: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 12,
  },
});
