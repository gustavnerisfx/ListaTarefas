import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@tema';
const ThemeContext = createContext();

export function AppThemeProvider({ children }) {
  const systemScheme = useColorScheme();
  
  const [isDark, setIsDark] = useState(systemScheme === 'dark');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved) setIsDark(saved === 'dark');
      })
      .finally(() => setReady(true));
  }, []);

  const setDarkMode = (value) => {
    setIsDark(value);
    AsyncStorage.setItem(STORAGE_KEY, value ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ isDark, setDarkMode, ready }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useAppTheme = () => useContext(ThemeContext);
