import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@tarefas';
const MAX_TIMEOUT = 2147483647; // limite do setTimeout (~24 dias)
const TasksContext = createContext();

// garante que tarefas salvas na versão antiga ganhem os novos campos
const normalize = (task) => ({
  description: '',
  dueAt: null,
  doneAt: null,
  createdAt: Date.now(),
  ...task,
});

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [now, setNow] = useState(Date.now());

  // carrega ao abrir o app
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((json) => {
        if (json) setTasks(JSON.parse(json).map(normalize));
      })
      .finally(() => setLoaded(true));
  }, []);

  // salva a cada alteração (só depois do carregamento inicial)
  useEffect(() => {
    if (loaded) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks, loaded]);

  // Relógio 1: atualiza a cada 30s (mantém textos como "Vence em 5 min" em dia)
  // e quando o app volta ao primeiro plano.
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30000);
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') setNow(Date.now());
    });
    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, []);

  // Relógio 2: agenda um alarme para o exato momento do próximo vencimento,
  // assim a tarefa vira "vencida" na hora, sem esperar os 30s.
  useEffect(() => {
    const current = Date.now();
    const next = tasks
      .filter((t) => !t.done && t.dueAt != null && t.dueAt > current)
      .reduce((min, t) => Math.min(min, t.dueAt), Infinity);

    if (next === Infinity) return undefined;

    const timeout = setTimeout(
      () => setNow(Date.now()),
      Math.min(next - current, MAX_TIMEOUT) + 300
    );
    return () => clearTimeout(timeout);
  }, [tasks, now]);

  const addTask = ({ title, description = '', dueAt = null }) => {
    setNow(Date.now());
    setTasks((prev) => [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title,
        description,
        dueAt,
        done: false,
        doneAt: null,
        createdAt: Date.now(),
      },
      ...prev,
    ]);
  };

  const updateTask = (id, changes) => {
    setNow(Date.now());
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...changes } : t)));
  };

  const toggleTask = (id) => {
    setNow(Date.now());
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, done: !t.done, doneAt: !t.done ? Date.now() : null }
          : t
      )
    );
  };

  const removeTask = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const clearDone = () => setTasks((prev) => prev.filter((t) => !t.done));

  return (
    <TasksContext.Provider
      value={{
        tasks,
        loaded,
        now,
        addTask,
        updateTask,
        toggleTask,
        removeTask,
        clearDone,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export const useTasks = () => useContext(TasksContext);
