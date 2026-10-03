import { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Banner,
  Button,
  Card,
  Checkbox,
  Divider,
  Icon,
  IconButton,
  List,
  Modal,
  Portal,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import data from '../data.json';
import SongListItem from '../components/SongListItem';
import { usePlayer } from '../context/PlayerContext';
import { usePlaylists } from '../context/PlaylistContext';

export default function PlaylistsScreen() {
  const theme = useTheme();
  const { reproducir } = usePlayer();
  const {
    playlists,
    cargando,
    error,
    cargarPlaylists,
    crearPlaylist,
    agregarCanciones,
  } = usePlaylists();
  const [playlistId, setPlaylistId] = useState(null);
  const [crearVisible, setCrearVisible] = useState(false);
  const [agregarVisible, setAgregarVisible] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [nombre, setNombre] = useState('');
  const [cancionesSeleccionadas, setCancionesSeleccionadas] = useState([]);

  const playlistActual = playlists.find((playlist) => playlist.id === playlistId);
  const cancionesPlaylist =
    playlistActual?.songIds
      .map((id) => data.canciones.find((cancion) => cancion.id === id))
      .filter(Boolean) ?? [];
  const cancionesDisponibles = data.canciones.filter(
    (cancion) => !playlistActual?.songIds.includes(cancion.id)
  );

  const abrirCreacion = () => {
    setNombre('');
    setCancionesSeleccionadas([]);
    setCrearVisible(true);
  };

  const abrirAgregar = () => {
    setCancionesSeleccionadas([]);
    setAgregarVisible(true);
  };

  const alternarSeleccion = (id) => {
    setCancionesSeleccionadas((actuales) =>
      actuales.includes(id) ? actuales.filter((cancionId) => cancionId !== id) : [...actuales, id]
    );
  };

  const guardarPlaylist = async () => {
    setGuardando(true);
    try {
      const id = await crearPlaylist(nombre, cancionesSeleccionadas);
      setCrearVisible(false);
      setPlaylistId(id);
    } catch (e) {
      console.error('No se pudo crear la playlist.', e);
    } finally {
      setGuardando(false);
    }
  };

  const guardarCanciones = async () => {
    if (!playlistActual) return;
    setGuardando(true);
    try {
      await agregarCanciones(playlistActual.id, cancionesSeleccionadas);
      setAgregarVisible(false);
    } catch (e) {
      console.error('No se pudieron añadir canciones a la playlist.', e);
    } finally {
      setGuardando(false);
    }
  };

  const renderSelectorCanciones = (canciones) =>
    canciones.map((cancion) => {
      const seleccionada = cancionesSeleccionadas.includes(cancion.id);
      return (
        <List.Item
          key={cancion.id}
          title={cancion.titulo}
          description={cancion.artista}
          onPress={() => alternarSeleccion(cancion.id)}
          left={() => (
            <Checkbox
              status={seleccionada ? 'checked' : 'unchecked'}
              onPress={() => alternarSeleccion(cancion.id)}
            />
          )}
        />
      );
    });

  if (cargando) {
    return (
      <SafeAreaView edges={['top']} style={[styles.pantalla, styles.centrado]}>
        <ActivityIndicator size="large" />
        <Text variant="bodyMedium" style={styles.margenSuperior}>Cargando playlists...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.pantalla}>
      {error ? (
        <Banner visible actions={[{ label: 'Reintentar', onPress: cargarPlaylists }]}>
          {error}
        </Banner>
      ) : null}

      {playlistActual ? (
        <View style={styles.pantalla}>
          <View style={styles.encabezadoDetalle}>
            <IconButton icon="arrow-left" onPress={() => setPlaylistId(null)} />
            <View style={styles.textosDetalle}>
              <Text variant="headlineSmall" numberOfLines={1} style={styles.negrita}>
                {playlistActual.name}
              </Text>
              <Text variant="bodyMedium" style={styles.gris}>
                {cancionesPlaylist.length}{' '}
                {cancionesPlaylist.length === 1 ? 'canción' : 'canciones'}
              </Text>
            </View>
          </View>

          <View style={styles.accionesDetalle}>
            <Button
              mode="contained"
              icon="play"
              disabled={cancionesPlaylist.length === 0}
              onPress={() => reproducir(cancionesPlaylist[0], cancionesPlaylist)}
            >
              Reproducir
            </Button>
            <Button mode="outlined" icon="plus" onPress={abrirAgregar} disabled={Boolean(error)}>
              Añadir canciones
            </Button>
          </View>

          <FlatList
            data={cancionesPlaylist}
            keyExtractor={(cancion) => cancion.id}
            renderItem={({ item }) => (
              <SongListItem cancion={item} onPress={() => reproducir(item, cancionesPlaylist)} />
            )}
            ListEmptyComponent={
              <View style={styles.vacio}>
                <Icon source="music-note-plus" size={48} color={theme.colors.onSurfaceVariant} />
                <Text variant="titleMedium" style={styles.tituloVacio}>Tu playlist está vacía</Text>
                <Text variant="bodyMedium" style={[styles.gris, styles.centradoTexto]}>
                  Añade canciones del catálogo para empezar a escucharla.
                </Text>
              </View>
            }
          />
        </View>
      ) : (
        <View style={styles.pantalla}>
          <View style={styles.encabezadoLista}>
            <View>
              <Text variant="headlineSmall" style={styles.negrita}>Playlists</Text>
              <Text variant="bodyMedium" style={styles.gris}>Tu música, a tu manera</Text>
            </View>
            <IconButton
              icon="plus"
              mode="contained"
              onPress={abrirCreacion}
              accessibilityLabel="Crear playlist"
              disabled={Boolean(error)}
            />
          </View>

          <FlatList
            data={playlists}
            keyExtractor={(playlist) => playlist.id}
            contentContainerStyle={playlists.length === 0 && styles.listaVacia}
            renderItem={({ item }) => {
              const canciones = item.songIds
                .map((id) => data.canciones.find((cancion) => cancion.id === id))
                .filter(Boolean);
              return (
                <Card mode="contained" onPress={() => setPlaylistId(item.id)} style={styles.tarjeta}>
                  <Card.Content style={styles.contenidoTarjeta}>
                    <View style={[styles.iconoPlaylist, { backgroundColor: theme.colors.primary }]}>
                      <Icon source="music" size={28} color={theme.colors.onPrimary} />
                    </View>
                    <View style={styles.textoTarjeta}>
                      <Text variant="titleMedium" numberOfLines={1} style={styles.negrita}>
                        {item.name}
                      </Text>
                      <Text variant="bodyMedium" style={styles.gris}>
                        {canciones.length} {canciones.length === 1 ? 'canción' : 'canciones'}
                      </Text>
                    </View>
                    <Icon source="chevron-right" size={24} color={theme.colors.onSurfaceVariant} />
                  </Card.Content>
                </Card>
              );
            }}
            ListEmptyComponent={
              <View style={styles.vacio}>
                <Icon source="playlist-plus" size={56} color={theme.colors.onSurfaceVariant} />
                <Text variant="titleMedium" style={styles.tituloVacio}>Aún no tienes playlists</Text>
                <Text variant="bodyMedium" style={[styles.gris, styles.centradoTexto]}>
                  Crea una playlist y reúne aquí las canciones que más te gustan.
                </Text>
                <Button mode="contained" icon="plus" onPress={abrirCreacion} style={styles.botonVacio}>
                  Crear playlist
                </Button>
              </View>
            }
          />
        </View>
      )}

      <Portal>
        <Modal
          visible={crearVisible}
          onDismiss={() => setCrearVisible(false)}
          contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.elevation.level3 }]}
        >
          <ScrollView keyboardShouldPersistTaps="handled">
            <Text variant="titleLarge" style={styles.tituloModal}>Crear playlist</Text>
            <TextInput
              label="Nombre de la playlist"
              value={nombre}
              onChangeText={setNombre}
              mode="outlined"
              maxLength={60}
              autoFocus
            />
            <Text variant="titleMedium" style={styles.subtituloModal}>Añadir canciones</Text>
            <Text variant="bodySmall" style={styles.gris}>
              También podrás añadir canciones después.
            </Text>
            {renderSelectorCanciones(data.canciones)}
            <Divider style={styles.divisor} />
            <View style={styles.botonesModal}>
              <Button onPress={() => setCrearVisible(false)}>Cancelar</Button>
              <Button
                mode="contained"
                onPress={guardarPlaylist}
                loading={guardando}
                disabled={!nombre.trim() || Boolean(error) || guardando}
              >
                Crear
              </Button>
            </View>
          </ScrollView>
        </Modal>

        <Modal
          visible={agregarVisible}
          onDismiss={() => setAgregarVisible(false)}
          contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.elevation.level3 }]}
        >
          <ScrollView>
            <Text variant="titleLarge" style={styles.tituloModal}>Añadir canciones</Text>
            <Text variant="bodyMedium" style={[styles.gris, styles.margenInferior]}>
              {playlistActual?.name}
            </Text>
            {cancionesDisponibles.length > 0 ? (
              renderSelectorCanciones(cancionesDisponibles)
            ) : (
              <Text variant="bodyMedium" style={styles.gris}>
                Ya añadiste todas las canciones disponibles.
              </Text>
            )}
            <Divider style={styles.divisor} />
            <View style={styles.botonesModal}>
              <Button onPress={() => setAgregarVisible(false)}>Cancelar</Button>
              <Button
                mode="contained"
                onPress={guardarCanciones}
                loading={guardando}
                disabled={cancionesSeleccionadas.length === 0 || Boolean(error) || guardando}
              >
                Añadir
              </Button>
            </View>
          </ScrollView>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1 },
  centrado: { alignItems: 'center', justifyContent: 'center' },
  margenSuperior: { marginTop: 12 },
  margenInferior: { marginBottom: 8 },
  encabezadoLista: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingTop: 8,
    paddingRight: 8,
  },
  encabezadoDetalle: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  textosDetalle: { flex: 1, marginRight: 16 },
  negrita: { fontWeight: 'bold' },
  gris: { color: '#B3B3B3' },
  accionesDetalle: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  tarjeta: { marginHorizontal: 16, marginVertical: 6 },
  contenidoTarjeta: { flexDirection: 'row', alignItems: 'center' },
  iconoPlaylist: { width: 56, height: 56, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  textoTarjeta: { flex: 1, marginHorizontal: 12 },
  listaVacia: { flexGrow: 1 },
  vacio: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  tituloVacio: { marginTop: 12, marginBottom: 4, fontWeight: 'bold' },
  centradoTexto: { textAlign: 'center' },
  botonVacio: { marginTop: 20 },
  modal: { width: '92%', maxHeight: '85%', alignSelf: 'center', padding: 20, borderRadius: 16 },
  tituloModal: { fontWeight: 'bold', marginBottom: 16 },
  subtituloModal: { fontWeight: 'bold', marginTop: 20, marginBottom: 4 },
  divisor: { marginTop: 8, marginBottom: 12 },
  botonesModal: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
});
