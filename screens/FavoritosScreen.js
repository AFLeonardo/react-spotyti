import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Icon, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import SongListItem from '../components/SongListItem';
import { usePlayer } from '../context/PlayerContext';

export default function FavoritosScreen() {
  const theme = useTheme();
  const { favoritos, reproducir } = usePlayer();

  return (
    <SafeAreaView edges={['top']} style={styles.pantalla}>
      <View style={styles.encabezado}>
        <View style={[styles.icono, { backgroundColor: theme.colors.primary }]}>
          <Icon source="heart" size={32} color="#FFFFFF" />
        </View>
        <View style={styles.textos}>
          <Text variant="headlineSmall" style={styles.negrita}>Tus me gusta</Text>
          <Text variant="bodyMedium" style={styles.gris}>
            {favoritos.length} {favoritos.length === 1 ? 'canción' : 'canciones'}
          </Text>
        </View>
      </View>

      {favoritos.length > 0 && (
        <Button
          mode="contained"
          icon="play"
          onPress={() => reproducir(favoritos[0], favoritos)}
          style={styles.botonPlay}
        >
          Reproducir
        </Button>
      )}

      <FlatList
        data={favoritos}
        keyExtractor={(c) => c.id}
        renderItem={({ item }) => <SongListItem cancion={item} onPress={() => reproducir(item, favoritos)} />}
        contentContainerStyle={favoritos.length === 0 && styles.vacioContenedor}
        ListEmptyComponent={
          <View style={styles.vacio}>
            <Icon source="heart-outline" size={56} color={theme.colors.onSurfaceVariant} />
            <Text variant="titleMedium" style={styles.vacioTitulo}>Aún no tienes favoritos</Text>
            <Text variant="bodyMedium" style={[styles.gris, styles.centrado]}>
              Toca el corazón de una canción para guardarla aquí.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1 },
  encabezado: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  icono: { width: 64, height: 64, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  textos: { marginLeft: 16 },
  negrita: { fontWeight: 'bold' },
  gris: { color: '#B3B3B3' },
  botonPlay: { alignSelf: 'flex-start', marginHorizontal: 16, marginBottom: 8 },
  vacioContenedor: { flexGrow: 1 },
  vacio: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  vacioTitulo: { marginTop: 12, marginBottom: 4, fontWeight: 'bold' },
  centrado: { textAlign: 'center' },
});
