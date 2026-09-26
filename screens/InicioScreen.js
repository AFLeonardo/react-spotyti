import { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { Chip, IconButton, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import data from '../data.json';
import SongCard from '../components/SongCard';
import SongListItem from '../components/SongListItem';
import { usePlayer } from '../context/PlayerContext';

const TODAS = 'Todas';

export default function InicioScreen() {
  const { reproducir } = usePlayer();
  const [categoria, setCategoria] = useState(TODAS);

  const canciones =
    categoria === TODAS
      ? data.canciones
      : data.canciones.filter((c) => c.categoria === categoria);

  return (
    <SafeAreaView edges={['top']} style={styles.pantalla}>
      <ScrollView contentContainerStyle={styles.contenido}>
        <View style={styles.encabezado}>
          <Text variant="headlineSmall" style={styles.negrita}>Hola, usuario ✨</Text>
          <View style={styles.fila}>
            <IconButton icon="bell-outline" onPress={() => {}} />
            <IconButton icon="cog-outline" onPress={() => {}} />
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {[TODAS, ...data.categorias].map((c) => (
            <Chip
              key={c}
              selected={categoria === c}
              showSelectedCheck={false}
              mode={categoria === c ? 'flat' : 'outlined'}
              onPress={() => setCategoria(c)}
              style={styles.chip}
            >
              {c}
            </Chip>
          ))}
        </ScrollView>

        <Text variant="titleLarge" style={styles.titulo}>Canciones populares</Text>
        <FlatList
          horizontal
          data={canciones}
          keyExtractor={(c) => c.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontal}
          renderItem={({ item }) => <SongCard cancion={item} onPress={() => reproducir(item, canciones)} />}
          ListEmptyComponent={<Text style={styles.vacio}>No hay canciones en esta categoría.</Text>}
        />

        <Text variant="titleLarge" style={styles.titulo}>
          {categoria === TODAS ? 'Todas las canciones' : categoria}
        </Text>
        {canciones.map((c) => (
          <SongListItem key={c.id} cancion={c} onPress={() => reproducir(c, canciones)} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1 },
  contenido: { paddingBottom: 16 },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingTop: 8,
  },
  fila: { flexDirection: 'row' },
  negrita: { fontWeight: 'bold' },
  chips: { paddingHorizontal: 16, paddingVertical: 8 },
  chip: { marginRight: 8, borderRadius: 16 },
  titulo: { fontWeight: 'bold', marginHorizontal: 16, marginTop: 20, marginBottom: 12 },
  horizontal: { paddingHorizontal: 16 },
  vacio: { color: '#B3B3B3' },
});
