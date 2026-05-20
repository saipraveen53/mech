import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BookingScreen() {
  const handleConfirm = () => {
    router.push('/payment');
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Details</Text>
      <Text>Mechanic: Raju</Text>
      <Text>Problem: Tyre Puncture</Text>
      <Text>Total: ₹150</Text>
      <TouchableOpacity style={styles.confirm} onPress={handleConfirm}>
        <Text style={styles.confirmText}>Confirm & Proceed to Payment</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  confirm: { backgroundColor: '#3b82f6', padding: 14, borderRadius: 12, marginTop: 30 },
  confirmText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
});