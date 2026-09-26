import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ProgressBar, Text, useTheme } from 'react-native-paper';
import { formatearTiempo, usePlayer } from '../context/PlayerContext';

// Barra de progreso; tocarla salta a esa parte de la canción
export default function BarraProgreso() {
  const theme = useTheme();
  const { posicion, duracion, buscar } = usePlayer();
  const [ancho, setAncho] = useState(0);
  const progreso = duracion > 0 ? Math.min(posicion / duracion, 1) : 0;

  const alTocar = (e) => {
    if (ancho <= 0 || duracion <= 0) return;
    buscar((e.nativeEvent.locationX / ancho) * duracion);
  };

  return (
    <View>
      <Pressable
        onPress={alTocar}
        onLayout={(e) => setAncho(e.nativeEvent.layout.width)}
        hitSlop={12}
        style={styles.zona}
      >
        <ProgressBar progress={progreso} color={theme.colors.onSurface} style={styles.barra} />
      </Pressable>
      <View style={styles.tiempos}>
        <Text variant="labelSmall" style={styles.tiempo}>{formatearTiempo(posicion)}</Text>
        <Text variant="labelSmall" style={styles.tiempo}>{formatearTiempo(duracion)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  zona: { paddingVertical: 8 },
  barra: { height: 4, borderRadius: 2, backgroundColor: '#4D4D4D' },
  tiempos: { flexDirection: 'row', justifyContent: 'space-between' },
  tiempo: { color: '#B3B3B3' },
});
