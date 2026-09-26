import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Inicio from './Inicio';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { useTheme } from 'react-native-paper';

export default function App() {
  
  const theme = useTheme();
  
  
  return (
    <PaperProvider>
    <SafeAreaProvider>
    <View style={{ backgroundColor: theme.colors.primary }}>
    <Inicio></Inicio>
    <StatusBar style="auto" />
    </View>
    </SafeAreaProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
