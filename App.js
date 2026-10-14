import { useEffect, useRef, useState } from 'react';
import { Animated, Image, Platform, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
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

if (Platform.OS !== 'web') {
  SplashScreen.preventAutoHideAsync().catch((error) => {
    console.warn('No se pudo mantener visible el splash screen:', error);
  });
}

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
  const [splashVisible, setSplashVisible] = useState(true);
  const splashOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let fadeAnimation;
    const timeout = setTimeout(() => {
      const hideNativeSplash = async () => {
        try {
          if (Platform.OS !== 'web') {
            await SplashScreen.hideAsync();
          }
        } catch (error) {
          console.warn('No se pudo ocultar el splash screen nativo:', error);
        }

        fadeAnimation = Animated.timing(splashOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        });
        fadeAnimation.start(({ finished }) => {
          if (finished) {
            setSplashVisible(false);
          }
        });
      };

      hideNativeSplash();
    }, 1600);

    return () => {
      clearTimeout(timeout);
      fadeAnimation?.stop();
    };
  }, [splashOpacity]);

  return (
    <SafeAreaProvider style={styles.contenedor}>
      <View style={styles.contenedor}>
        <PaperProvider theme={theme}>
          <PlayerProvider>
            <PlaylistProvider>
              <Principal />
            </PlaylistProvider>
            <StatusBar style={splashVisible ? 'dark' : 'light'} />
          </PlayerProvider>
        </PaperProvider>
        {splashVisible && (
          <Animated.View
            style={[styles.splash, { opacity: splashOpacity }]}
            accessibilityLabel="Spotyti"
          >
            <Image
              source={require('./assets/splash.png')}
              style={styles.splashImage}
              resizeMode="contain"
              accessibilityLabel="Spotyti App"
            />
          </Animated.View>
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1 },
  splash: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    zIndex: 1,
    elevation: 1,
  },
  splashImage: {
    width: 280,
    height: 280,
  },
});
