import { Image, StyleSheet } from 'react-native';
import { IconButton, List, useTheme } from 'react-native-paper';
import { usePlayer } from '../context/PlayerContext';

// Fila de canción con portada y botón de favorito
export default function SongListItem({ cancion, onPress }) {
  const theme = useTheme();
  const { cancionActual, esFavorito, alternarFavorito } = usePlayer();
  const activa = cancionActual?.id === cancion.id;
  const favorito = esFavorito(cancion.id);

  return (
    <List.Item
      title={cancion.titulo}
      description={cancion.artista}
      titleStyle={activa && { color: theme.colors.primary }}
      titleNumberOfLines={1}
      descriptionNumberOfLines={1}
      onPress={onPress}
      left={() => <Image source={{ uri: cancion.portada }} style={styles.portada} />}
      right={() => (
        <IconButton
          icon={favorito ? 'heart' : 'heart-outline'}
          iconColor={favorito ? theme.colors.primary : theme.colors.onSurfaceVariant}
          onPress={() => alternarFavorito(cancion)}
          accessibilityLabel={favorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        />
      )}
      style={styles.item}
    />
  );
}

const styles = StyleSheet.create({
  item: { paddingVertical: 4, paddingRight: 0 },
  portada: { width: 52, height: 52, borderRadius: 4, marginLeft: 8, backgroundColor: '#282828' },
});
