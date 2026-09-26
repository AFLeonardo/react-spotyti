import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  // Un solo reproductor para toda la app; cambiamos la canción con replace()
  const player = useAudioPlayer(null, { updateInterval: 500 });
  const status = useAudioPlayerStatus(player);

  const [cola, setCola] = useState([]);
  const [indice, setIndice] = useState(-1);
  const [favoritos, setFavoritos] = useState([]);

  const cancionActual = indice >= 0 ? cola[indice] : null;

  useEffect(() => {
    // Que suene aunque el iPhone esté en modo silencio
    setAudioModeAsync({ playsInSilentMode: true });
  }, []);

  const cargar = useCallback(
    (lista, nuevoIndice) => {
      setCola(lista);
      setIndice(nuevoIndice);
      player.replace({ uri: lista[nuevoIndice].audio });
      player.play();
    },
    [player]
  );

  // Reproduce una canción; la lista define qué suena con "siguiente"/"anterior"
  const reproducir = useCallback(
    (cancion, lista = [cancion]) => {
      if (cancionActual?.id === cancion.id) {
        player.play();
        return;
      }
      cargar(lista, Math.max(0, lista.findIndex((c) => c.id === cancion.id)));
    },
    [cancionActual, cargar, player]
  );

  const alternarPausa = useCallback(() => {
    if (!cancionActual) return;
    if (status.playing) {
      player.pause();
    } else {
      // Si terminó, vuelve a empezar
      if (status.duration > 0 && status.currentTime >= status.duration) player.seekTo(0);
      player.play();
    }
  }, [cancionActual, player, status.playing, status.currentTime, status.duration]);

  const siguiente = useCallback(() => {
    if (cola.length === 0) return;
    cargar(cola, (indice + 1) % cola.length);
  }, [cola, indice, cargar]);

  const anterior = useCallback(() => {
    if (cola.length === 0) return;
    // Igual que Spotify: si ya avanzó unos segundos, reinicia la canción
    if (status.currentTime > 3) {
      player.seekTo(0);
      return;
    }
    cargar(cola, (indice - 1 + cola.length) % cola.length);
  }, [cola, indice, cargar, player, status.currentTime]);

  const buscar = useCallback((segundos) => player.seekTo(segundos), [player]);

  // Pasa a la siguiente canción cuando termina la actual
  useEffect(() => {
    if (status.didJustFinish) siguiente();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status.didJustFinish]);

  const esFavorito = useCallback((id) => favoritos.some((c) => c.id === id), [favoritos]);

  const alternarFavorito = useCallback((cancion) => {
    setFavoritos((actuales) =>
      actuales.some((c) => c.id === cancion.id)
        ? actuales.filter((c) => c.id !== cancion.id)
        : [...actuales, cancion]
    );
  }, []);

  const value = {
    cancionActual,
    reproduciendo: status.playing,
    cargando: status.isBuffering || (cancionActual && !status.isLoaded),
    posicion: status.currentTime,
    duracion: status.duration,
    reproducir,
    alternarPausa,
    siguiente,
    anterior,
    buscar,
    favoritos,
    esFavorito,
    alternarFavorito,
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer debe usarse dentro de <PlayerProvider>');
  return ctx;
}

export function formatearTiempo(segundos) {
  if (!segundos || segundos < 0) return '0:00';
  const m = Math.floor(segundos / 60);
  const s = Math.floor(segundos % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
