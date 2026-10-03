import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'spotipy.playlists.v1';
const PlaylistContext = createContext(null);

function parsePlaylists(serialized) {
  const playlists = JSON.parse(serialized);
  if (
    !Array.isArray(playlists) ||
    playlists.some(
      (playlist) =>
        typeof playlist?.id !== 'string' ||
        typeof playlist?.name !== 'string' ||
        !Array.isArray(playlist?.songIds) ||
        playlist.songIds.some((id) => typeof id !== 'string')
    )
  ) {
    throw new Error('El formato de las playlists guardadas no es válido.');
  }
  return playlists;
}

export function PlaylistProvider({ children }) {
  const [playlists, setPlaylists] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const playlistsRef = useRef([]);
  const colaMutaciones = useRef(Promise.resolve());

  const cargarPlaylists = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const loaded = stored === null ? [] : parsePlaylists(stored);
      playlistsRef.current = loaded;
      setPlaylists(loaded);
    } catch (e) {
      console.error('No se pudieron cargar las playlists.', e);
      setError('No se pudieron cargar tus playlists. Inténtalo de nuevo.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarPlaylists();
  }, [cargarPlaylists]);

  const actualizarPlaylists = useCallback((actualizar) => {
    const operacion = colaMutaciones.current.then(async () => {
      const siguientes = actualizar(playlistsRef.current);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(siguientes));
      playlistsRef.current = siguientes;
      setPlaylists(siguientes);
      setError(null);
      return siguientes;
    });
    colaMutaciones.current = operacion.catch(() => {});
    return operacion.catch((e) => {
      setError('No se pudieron guardar tus playlists. Inténtalo de nuevo.');
      throw e;
    });
  }, []);

  const crearPlaylist = useCallback(
    (nombre, songIds = []) => {
      const playlist = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: nombre.trim(),
        songIds: [...new Set(songIds)],
      };
      return actualizarPlaylists((actuales) => [...actuales, playlist]).then(() => playlist.id);
    },
    [actualizarPlaylists]
  );

  const agregarCanciones = useCallback(
    (playlistId, songIds) =>
      actualizarPlaylists((actuales) =>
        actuales.map((playlist) =>
          playlist.id === playlistId
            ? { ...playlist, songIds: [...new Set([...playlist.songIds, ...songIds])] }
            : playlist
        )
      ),
    [actualizarPlaylists]
  );

  const value = {
    playlists,
    cargando,
    error,
    cargarPlaylists,
    crearPlaylist,
    agregarCanciones,
  };

  return <PlaylistContext.Provider value={value}>{children}</PlaylistContext.Provider>;
}

export function usePlaylists() {
  const context = useContext(PlaylistContext);
  if (!context) throw new Error('usePlaylists debe usarse dentro de <PlaylistProvider>');
  return context;
}
