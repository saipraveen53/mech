import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PaymentScreen() {
  const handleUPI = () => {
    // Integrate Razorpay / UPI intent here
    router.push('/payment/success');
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Payment Method</Text>
      <TouchableOpacity style={styles.option} onPress={handleUPI}>
        <Text>📱 UPI (GPay/PhonePe)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={handleUPI}>
        <Text>💵 Cash</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={handleUPI}>
        <Text>💳 Card</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  option: { padding: 16, backgroundColor: '#f3f4f6', borderRadius: 12, marginBottom: 12 },
});