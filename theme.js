import { MD3DarkTheme } from 'react-native-paper';

// Tema oscuro inspirado en Spotify
export const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#1DB954',
    onPrimary: '#000000',
    primaryContainer: '#1DB954',
    onPrimaryContainer: '#000000',
    secondaryContainer: '#1DB95433',
    onSecondaryContainer: '#FFFFFF',
    background: '#121212',
    surface: '#121212',
    surfaceVariant: '#282828',
    onSurface: '#FFFFFF',
    onSurfaceVariant: '#B3B3B3',
    elevation: {
      ...MD3DarkTheme.colors.elevation,
      level1: '#181818',
      level2: '#1F1F1F',
      level3: '#282828',
    },
  },
};
