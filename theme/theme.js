import {
  MD3LightTheme,
  MD3DarkTheme,
  adaptNavigationTheme,
} from 'react-native-paper';
import {
  DefaultTheme as NavigationLight,
  DarkTheme as NavigationDark,
} from '@react-navigation/native';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#5B5BD6',
    onPrimary: '#FFFFFF',
    primaryContainer: '#E3E2FF',
    onPrimaryContainer: '#15145A',
    background: '#F5F6FB',
    onBackground: '#1B1C24',
    surface: '#FFFFFF',
    onSurface: '#1B1C24',
    surfaceVariant: '#ECEEF7',
    onSurfaceVariant: '#5D6075',
    outline: '#C9CBDA',
    outlineVariant: '#E1E3EE',
    error: '#D92D20',
    onError: '#FFFFFF',
    errorContainer: '#FEE4E2',
    onErrorContainer: '#7A271A',
    elevation: {
      level0: 'transparent',
      level1: '#FFFFFF',
      level2: '#FFFFFF',
      level3: '#F8F8FD',
      level4: '#F3F4FB',
      level5: '#EEF0F9',
    },
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#A5A6FF',
    onPrimary: '#1C1B6B',
    primaryContainer: '#33358C',
    onPrimaryContainer: '#E3E2FF',
    background: '#0E0F16',
    onBackground: '#E5E6F0',
    surface: '#171822',
    onSurface: '#E5E6F0',
    surfaceVariant: '#262836',
    onSurfaceVariant: '#A9ABC0',
    outline: '#4A4D63',
    outlineVariant: '#2B2D3D',
    error: '#F97066',
    onError: '#55160C',
    errorContainer: '#4A1A17',
    onErrorContainer: '#FECDCA',
    elevation: {
      level0: 'transparent',
      level1: '#171822',
      level2: '#171822',
      level3: '#1E2030',
      level4: '#222436',
      level5: '#272A3C',
    },
  },
};

// Gera os temas do React Navigation (header, tab bar, fundo) a partir dos do Paper
const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationLight,
  reactNavigationDark: NavigationDark,
  materialLight: lightTheme,
  materialDark: darkTheme,
});

export const navLightTheme = LightTheme;
export const navDarkTheme = DarkTheme;
