import { Image, Modal, StyleSheet, useWindowDimensions, View } from 'react-native';
import { ActivityIndicator, IconButton, Text, useTheme } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import BarraProgreso from '../components/BarraProgreso';
import { usePlayer } from '../context/PlayerContext';

// Vista de reproducción a pantalla completa (se abre desde el MiniPlayer)
export default function ReproducirScreen({ visible, onClose }) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const {
    cancionActual,
    reproduciendo,
    cargando,
    alternarPausa,
    siguiente,
    anterior,
    esFavorito,
    alternarFavorito,
  } = usePlayer();

  if (!cancionActual) return null;
  const favorito = esFavorito(cancionActual.id);
  const tamPortada = Math.min(width - 48, 380);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      {/* El Modal es una ventana nativa aparte: necesita su propio SafeAreaProvider */}
      <SafeAreaProvider>
        <SafeAreaView style={[styles.pantalla, { backgroundColor: theme.colors.background }]}>
          <View style={styles.barraSuperior}>
            <IconButton icon="chevron-down" size={28} onPress={onClose} accessibilityLabel="Cerrar" />
            <View style={styles.centro}>
              <Text variant="labelSmall" style={styles.gris}>REPRODUCIENDO DESDE</Text>
              <Text variant="labelLarge" numberOfLines={1}>{cancionActual.album}</Text>
            </View>
            <IconButton icon="dots-vertical" onPress={() => {}} />
          </View>

          <View style={styles.cuerpo}>
            <Image
              source={{ uri: cancionActual.portada }}
              style={[styles.portada, { width: tamPortada, height: tamPortada }]}
            />

            <View style={styles.infoFila}>
              <View style={styles.info}>
                <Text variant="headlineSmall" numberOfLines={1} style={styles.negrita}>
                  {cancionActual.titulo}
                </Text>
                <Text variant="titleMedium" numberOfLines={1} style={styles.gris}>
                  {cancionActual.artista}
                </Text>
              </View>
              <IconButton
                icon={favorito ? 'heart' : 'heart-outline'}
                iconColor={favorito ? theme.colors.primary : theme.colors.onSurface}
                size={28}
                onPress={() => alternarFavorito(cancionActual)}
                accessibilityLabel={favorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              />
            </View>

            <BarraProgreso />

            <View style={styles.controles}>
              <IconButton icon="skip-previous" size={40} onPress={anterior} accessibilityLabel="Anterior" />
              <View style={styles.botonPlay}>
                {cargando ? (
                  <ActivityIndicator size={32} color="#000000" />
                ) : (
                  <IconButton
                    icon={reproduciendo ? 'pause' : 'play'}
                    iconColor="#000000"
                    size={40}
                    onPress={alternarPausa}
                    accessibilityLabel={reproduciendo ? 'Pausar' : 'Reproducir'}
                  />
                )}
              </View>
              <IconButton icon="skip-next" size={40} onPress={siguiente} accessibilityLabel="Siguiente" />
            </View>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1 },
  barraSuperior: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 4 },
  centro: { flex: 1, alignItems: 'center' },
  cuerpo: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  portada: { alignSelf: 'center', borderRadius: 8, marginBottom: 32, backgroundColor: '#282828' },
  infoFila: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  info: { flex: 1 },
  negrita: { fontWeight: 'bold' },
  gris: { color: '#B3B3B3' },
  controles: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: 16,
  },
  botonPlay: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
