import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kolliq</Text>
      <Text style={styles.subtitle}>App is Live</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: '#4F46E5',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#6B7280',
  },
});
