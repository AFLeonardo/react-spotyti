import { Image, Pressable, StyleSheet, View } from 'react-native';
import { ActivityIndicator, IconButton, ProgressBar, Text, useTheme } from 'react-native-paper';
import { usePlayer } from '../context/PlayerContext';

// Barra fija arriba de las pestañas; al tocarla abre la vista Reproducir
export default function MiniPlayer({ onPress }) {
  const theme = useTheme();
  const {
    cancionActual,
    reproduciendo,
    cargando,
    posicion,
    duracion,
    alternarPausa,
    esFavorito,
    alternarFavorito,
  } = usePlayer();

  if (!cancionActual) return null;
  const favorito = esFavorito(cancionActual.id);

  return (
    <Pressable onPress={onPress} style={styles.contenedor}>
      <View style={styles.fila}>
        <Image source={{ uri: cancionActual.portada }} style={styles.portada} />
        <View style={styles.textos}>
          <Text variant="titleSmall" numberOfLines={1}>{cancionActual.titulo}</Text>
          <Text variant="bodySmall" numberOfLines={1} style={styles.artista}>
            {cancionActual.artista}
          </Text>
        </View>
        <IconButton
          icon={favorito ? 'heart' : 'heart-outline'}
          iconColor={favorito ? theme.colors.primary : theme.colors.onSurface}
          onPress={() => alternarFavorito(cancionActual)}
        />
        {cargando ? (
          <ActivityIndicator size={20} style={styles.cargando} />
        ) : (
          <IconButton
            icon={reproduciendo ? 'pause' : 'play'}
            iconColor={theme.colors.onSurface}
            onPress={alternarPausa}
            accessibilityLabel={reproduciendo ? 'Pausar' : 'Reproducir'}
          />
        )}
      </View>
      <ProgressBar
        progress={duracion > 0 ? Math.min(posicion / duracion, 1) : 0}
        color={theme.colors.onSurface}
        style={styles.barra}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    marginHorizontal: 8,
    marginBottom: 4,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#2A2A2A',
  },
  fila: { flexDirection: 'row', alignItems: 'center', paddingLeft: 8, paddingVertical: 6 },
  portada: { width: 40, height: 40, borderRadius: 4 },
  textos: { flex: 1, marginLeft: 10 },
  artista: { color: '#B3B3B3' },
  cargando: { marginHorizontal: 14 },
  barra: { height: 2, backgroundColor: '#4D4D4D' },
});
