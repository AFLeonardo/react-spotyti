import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

// Tarjeta cuadrada para listas horizontales (Canciones populares)
export default function SongCard({ cancion, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && { opacity: 0.7 }]}>
      <Image source={{ uri: cancion.portada }} style={styles.portada} />
      <View>
        <Text variant="titleSmall" numberOfLines={1}>
          {cancion.titulo}
        </Text>
        <Text variant="bodySmall" numberOfLines={1} style={styles.artista}>
          {cancion.artista}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { width: 140, marginRight: 12 },
  portada: { width: 140, height: 140, borderRadius: 8, marginBottom: 8, backgroundColor: '#282828' },
  artista: { color: '#B3B3B3' },
});
