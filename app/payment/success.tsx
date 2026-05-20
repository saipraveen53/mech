import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PaymentSuccess() {
  return (
    <View style={styles.container}>
      <Text style={styles.success}>✅ Payment Successful!</Text>
      <Text>Mechanic will reach you shortly.</Text>
      <TouchableOpacity style={styles.homeBtn} onPress={() => router.push('/(tabs)/home')}>
        <Text>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 },
  success: { fontSize: 24, fontWeight: 'bold', color: '#10b981' },
  homeBtn: { backgroundColor: '#3b82f6', padding: 12, borderRadius: 8 },
});