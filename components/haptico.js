
import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';

import * as Haptics from 'expo-haptics';

export async function hapticoConfirmar() {
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

export async function hapticoCancelar() {
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
}

export async function hapticoSeleccionar() {
  await Haptics.selectionAsync();
}

export default function Haptico() {
  const [mensaje, setMensaje] = useState(
    'Presiona un botón para probar'
  );

  const confirmar = async () => {
    await hapticoConfirmar();
    setMensaje('¡Acción completada correctamente!');
  };

  const mostrarError = async () => {
    await hapticoCancelar();
    setMensaje('Ocurrió un error. Intenta de nuevo.');
  };

  const seleccionar = async () => {
    await hapticoSeleccionar();
    setMensaje('Has seleccionado una opción');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📱</Text>

      <Text style={styles.title}>
        Laboratorio háptico
      </Text>

      <Text style={styles.description}>
        Toca los botones y siente la respuesta
        de tu dispositivo.
      </Text>

      <Pressable
        style={[styles.button, styles.success]}
        onPress={confirmar}
      >
        <Text style={styles.buttonText}>
          ✅Confirmar
        </Text>
      </Pressable>

      <Pressable
        style={[styles.button, styles.error]}
        onPress={mostrarError}
      >
        <Text style={styles.buttonText}>
          ❌Simular error
        </Text>
      </Pressable>

      <Pressable
        style={[styles.button, styles.selection]}
        onPress={seleccionar}
      >
        <Text style={styles.buttonText}>
          Seleccionar opción👀
        </Text>
      </Pressable>

      <View style={styles.messageBox}>
        <Text style={styles.messageTitle}>
          Resultado
        </Text>
        <Text style={styles.message}>
          {mensaje}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  emoji: {
    fontSize: 44,
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#172554',
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 12,
  },
  button: {
    width: '100%',
    paddingVertical: 17,
    borderRadius: 14,
    alignItems: 'center',
  },
  success: {
    backgroundColor: '#15803D',
  },
  error: {
    backgroundColor: '#DC2626',
  },
  selection: {
    backgroundColor: '#2563EB',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  messageBox: {
    width: '100%',
    padding: 18,
    marginTop: 8,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  messageTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#64748B',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#172554',
    textAlign: 'center',
  },
});
