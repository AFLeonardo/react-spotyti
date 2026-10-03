import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { BottomNavigation, PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from './theme';
import { PlayerProvider } from './context/PlayerContext';
import { PlaylistProvider } from './context/PlaylistContext';
import InicioScreen from './screens/InicioScreen';
import FavoritosScreen from './screens/FavoritosScreen';
import PlaylistsScreen from './screens/PlaylistsScreen';
import ReproducirScreen from './screens/ReproducirScreen';
import MiniPlayer from './components/MiniPlayer';

const rutas = [
  { key: 'inicio', title: 'Inicio', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
  { key: 'favoritos', title: 'Favoritos', focusedIcon: 'heart', unfocusedIcon: 'heart-outline' },
  { key: 'playlists', title: 'Playlists', focusedIcon: 'playlist-music', unfocusedIcon: 'playlist-music-outline' },
];

const pantallas = {
  inicio: InicioScreen,
  favoritos: FavoritosScreen,
  playlists: PlaylistsScreen,
};

function Principal() {
  const [indice, setIndice] = useState(0);
  const [reproductorVisible, setReproductorVisible] = useState(false);
  const Pantalla = pantallas[rutas[indice].key];

  return (
    <View style={[styles.contenedor, { backgroundColor: theme.colors.background }]}>
      <View style={styles.contenedor}>
        <Pantalla />
      </View>
      <MiniPlayer onPress={() => setReproductorVisible(true)} />
      {/* Usamos solo la barra de Paper para poder colocar el MiniPlayer encima */}
      <BottomNavigation.Bar
        navigationState={{ index: indice, routes: rutas }}
        onTabPress={({ route }) => setIndice(rutas.findIndex((r) => r.key === route.key))}
      />
      <ReproducirScreen visible={reproductorVisible} onClose={() => setReproductorVisible(false)} />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <PlayerProvider>
          <PlaylistProvider>
            <Principal />
          </PlaylistProvider>
          <StatusBar style="light" />
        </PlayerProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1 },
});
