import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider, useTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AppThemeProvider, useAppTheme } from './context/ThemeContext';
import { TasksProvider, useTasks } from './context/TasksContext';
import { darkTheme, lightTheme, navDarkTheme, navLightTheme } from './theme/theme';
import { isOverdue } from './utils/taskUtils';
import Logo from './components/Logo';
import PendingScreen from './screens/PendingScreen';
import DoneScreen from './screens/DoneScreen';
import SettingsScreen from './screens/SettingsScreen';
import TaskFormScreen from './screens/TaskFormScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs() {
  const { colors } = useTheme();
  const { tasks, now } = useTasks();

  const overdueCount = tasks.filter((t) => isOverdue(t, now)).length;

  return (
    <Tab.Navigator
      screenOptions={{
        headerTitleAlign: 'left',
        headerShadowVisible: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
        tabBarLabelStyle: { fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="Pendentes"
        component={PendingScreen}
        options={{
          headerTitle: () => <Logo size={30} />,
          tabBarBadge: overdueCount > 0 ? overdueCount : undefined,
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'clipboard-text' : 'clipboard-text-outline'}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Concluídas"
        component={DoneScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'check-circle' : 'check-circle-outline'}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Configurações"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'cog' : 'cog-outline'}
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function Root() {
  const { isDark, ready } = useAppTheme();

  if (!ready) return null;

  return (
    <PaperProvider theme={isDark ? darkTheme : lightTheme}>
      <TasksProvider>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <NavigationContainer theme={isDark ? navDarkTheme : navLightTheme}>
          <Stack.Navigator>
            <Stack.Screen
              name="Tabs"
              component={Tabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TaskForm"
              component={TaskFormScreen}
              options={({ route }) => ({
                title: route.params?.taskId ? 'Editar tarefa' : 'Nova tarefa',
                presentation: 'modal',
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </TasksProvider>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppThemeProvider>
        <Root />
      </AppThemeProvider>
    </SafeAreaProvider>
  );
}
